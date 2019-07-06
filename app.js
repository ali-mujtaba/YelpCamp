var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require("./seeds");
// mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://hostmaster:webdevbootcamp@cluster0-zwrwb.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(function(){
	console.log("Connected to DB");
}).catch(err,function(){
	console.log("ERROR: "+err.message);
});
//seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGS
app.use(require('express-session')({
  secret: "I love campgrounds.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.get("/",function(req,res){
    res.render("landing");
});

var indexRoutes = require('./routes/index');
var campgroundRoutes = require('./routes/campgrounds');
var commentRoutes = require('./routes/comments');
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000,process.env.IP,function(){
    console.log("YelpCamp Server started!");
});
