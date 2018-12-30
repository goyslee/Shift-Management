var User = require("../models/user");
var Comment = require("../models/comment");
//middlewares all
var middlewareObj = {};
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in first.");
    res.redirect("/login");
};
middlewareObj.notLoggedIn = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};
middlewareObj.loggedInAlready = function(req, res, next) {
    if (!req.user) {
        return next();
    }
    req.flash("error", "You are logged in already!");
    res.redirect('/');
};
middlewareObj.isAdmin = function(req, res, next) {
    if (req.user.isAdmin == true) {
        return next();
    } else {
        req.flash("error", "You do not have permission for this action! Use admin and superadmin log in. User: tjoe, Password: tjoe ");
        res.redirect('back');
    }
};
middlewareObj.checkCommentOwnership = function(req, res, next) { //AUTHORIZATION MIDDLEWARE!TFDATABASE!!!
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err || !foundComment) {
                console.log(err);
                req.flash("error", "Comment has not found.");
                res.redirect("back");
            } else {
                //does the user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    if (req.isAuthenticated() && req.user.isAdmin == true) {
                        return next();
                    }
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}
module.exports = middlewareObj;