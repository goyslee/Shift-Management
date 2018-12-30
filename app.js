var express            = require("express"), // npm install express ejs method-override body-parser connect-flash mongoose passport passport-local async nodemailer passport-local-mongoose --save
	methodOverride     = require("method-override"),
    app                = express(),
    bodyParser         = require("body-parser"),
    // nodemailer = require("nodemailer"),
    flash              = require("connect-flash"),
    mongoose           = require("mongoose"),
    passport           = require("passport"),//v6
    LocalStrategy      = require("passport-local"),//v6
    Colleague          = require("./models/colleague"),
    User               = require("./models/user");//v6

    // seedDB             = require("./seeds");
var   colleaguecommentsRoutes    = require("./routes/colleaguecomments");
var   colleaguesRoutes      = require("./routes/colleagues");
var   indexRoutes           = require("./routes/index");
var   shiftRoutes           = require("./routes/shift");
var   allocatorsRoutes      = require("./routes/allocators");

var options = {useMongoClient: true
                }
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL, options);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({ //v6
    secret: process.env.SECRETPASS,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());//v6
app.use(passport.session());//v6
passport.use(new LocalStrategy(User.authenticate()));//v6
passport.serializeUser(User.serializeUser());//v6
passport.deserializeUser(User.deserializeUser());//v6

app.use(function(req, res, next){
    res.locals.currentUser = req.user; //adding currentUser to every single page (header!!!)
    res.locals.administrator = adminUser;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
   next();
});

app.use("/colleagues/:id/comments", colleaguecommentsRoutes);
app.use(indexRoutes);
app.use("/colleagues", colleaguesRoutes);
app.use("/shift", shiftRoutes);
app.use("/allocator", allocatorsRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Shift Management app is running!");
});

// app.listen(3000, 'localhost', function(){
//     console.log("Job allocation app is running!");
// });