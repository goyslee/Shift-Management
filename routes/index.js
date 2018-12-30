var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer"); //v17
var crypto = require("crypto");
var middleware = require("../middleware");
router.get("/", function(req, res) {
    res.render("JobAllocations");
});
router.get("/help", function(req, res) {
    res.render("help/help");
});
//=======================
//AUTH ROUTES
//=======================
//show register form
router.get("/register", function(req, res) {
    res.render("register");
});
//handle signup logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        secretCode: req.body.secretCode
    });
    if (!req.body.secretCode || req.body.secretCode !== process.env.MEMBERSHIP) {
        req.flash("error", "You need invitation code to sign up!");
        res.redirect("back");
    } else {
        if (req.body.isAdmin === process.env.ADMIN) { // v14
            newUser.isAdmin = true; //v14
        } // eval(require("locus")); // v14 ---  npm i locus
        if (req.body.isSuperAdmin === process.env.SUPERADMIN) { // v14
            newUser.isSuperAdmin = true;
            newUser.isAdmin = true;
        } // eval(require("locus")); // v14 ---  npm i locus
        User.register(newUser, req.body.password, function(err, user) {
            if (err) {
                console.log(err);
                return res.render("register", {
                    error: err.message
                });
            }
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to Shif Management Project " + user.firstName + "!");
                res.redirect("/");
            });
        });
    }
});
//show login form
router.get("/login", middleware.loggedInAlready, function(req, res) {
    res.render("login");
});
//handling login logic
router.post("/login", middleware.loggedInAlready, passport.authenticate("local", {
    successRedirect: "/",
    successFlash: 'Welcome back ' + '!',
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {
});
//logout route
router.get("/logout", function(req, res) {
    // var username = req.params.username;
    req.logout(); //comes from a package we have install
    req.flash("success", "You have successfully logged out, See you later!");
    res.redirect("/");
});
router.get("/forgot", function(req, res) {
    res.render("forgot");
});
router.post('/forgot', function(req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({
                email: req.body.email
            }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                if (user.username === "tjoe") {
                    req.flash('error', 'You cannot change Test User password.');
                    return res.redirect('/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'passswordResetOfSurvivors@gmail.com',
                    pass: process.env.TOKENPASS
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passswordResetOfSurvivors@gmail.com',
                subject: 'Land Of Survivors Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});
router.get('/reset/:token', function(req, res) {
    User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            token: req.params.token
        });
    });
});
router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {
                    $gt: Date.now()
                }
            }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'passswordResetOfSurvivors@gmail.com',
                    pass: process.env.TOKENPASS
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passswordResetOfSurvivors@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
});
//USERS PROFILE ROUTE
router.get("/user/:id", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/");
        }
        res.render("users/show", {
            user: foundUser
        });
    });
});
//USER PAGE SHOW ROUTE
router.get("/users", function(req, res) {
    var noMatch = ""; //v15
    if (req.query.search) { //v15
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({
            username: regex
        }, null, {
            sort: {
                username: 1
            }
        }, function(err, allUser) {
            if (err) {
                console.log(err);
                res.redirect("/");
            }
            res.render("users/usershow", {
                user: allUser,
                noMatch: noMatch
            });
        });
    } else {
        User.find({}, null, {
            sort: {
                username: 1
            }
        }, function(err, allUser) {
            if (err) {
                console.log(err);
                res.redirect("/");
            }
            res.render("users/usershow", {
                user: allUser,
                noMatch: noMatch
            });
        });
    }
});
// DELETE ROUTE
router.delete("/users/:id", function(req, res) {
    //destroy blog
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/");
        } else {
            req.flash("success", "User deleted.");
            res.redirect("/users");
        }
    });
    //redirect somewhere
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); //v15 Fuzzy search
}
module.exports = router;