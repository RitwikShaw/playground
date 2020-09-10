var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var flash = require("connect-flash");
var methodOverride = require("method-override");
var Campground=require("./models/campground");
var User=require("./models/user");
var Comment = require("./models/comment");
var cors = require('cors');
var seedDB = require("./seeds");

var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");
var commentRoutes=require("./routes/comments");

mongoose.connect("mongodb+srv://zatura:zatura990z@zatura-gvgw8.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
mongoose.connection.on('connected',()=>{
	console.log('connected');
})
mongoose.connection.on('err',()=>{
	console.log('error');
})


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(require("express-session")({
	secret:"you are lucky",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




var port = 3000;
app.listen(port, ()=>{
	console.log("you make it till here");
});
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The playgrounds Server Has Started!");
});
