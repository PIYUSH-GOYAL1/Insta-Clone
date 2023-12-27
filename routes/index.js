var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const upload = require("./multer");
const passport = require("passport");
const localStrategy = require("passport-local");
// const multer = require('multer');

passport.use(new localStrategy(userModel.authenticate())); 

router.get("/" , function(req ,res){
  res.render("index");
});
router.get("/login"  ,  function(req ,res){
  res.render("login");
});
router.get("/profile" ,isLoggedIn, async function(req ,res){
  const user = await userModel.findOne({username : req.session.passport.user}).populate("posts");
  res.render("profile" , {user});
});
router.get("/edit" ,isLoggedIn, async function(req ,res){
  const user = await userModel.findOne({username : req.session.passport.user})
  res.render("edit" , {user});
});
router.get("/feed" ,isLoggedIn, async function(req ,res){
  const posts = await postModel.find().populate("user");
  res.render("feed" , {posts});
});
router.get("/upload" ,isLoggedIn, function(req ,res){
  res.render("upload");
});
router.get("/search" ,isLoggedIn, function(req ,res){
  res.render("search");
});

router.post("/register" , function(req , res , next) {
  const userData = new userModel({
    username : req.body.username,
    fullname : req.body.fullname,
    email : req.body.email
  });
  userModel.register(userData , req.body.password)
  .then(function(){
    passport.authenticate("local")(req , res , function(){
      res.redirect("/profile");
    })
  })
})

router.post("/login" , passport.authenticate("local" , {
  successRedirect : "/profile",
  failureRedirect : "/login"
}),function(req , res) {

})

router.get("/logout" , function(req , res , next) {
  req.logOut(function(err){
    if (err) {return next(err);}
    res.redirect("/");
  })
})

router.post("/edit" , upload.single("dp"), async function(req , res) {
  const user = await userModel.findOneAndUpdate({username : req.session.passport.user} , {username : req.body.username , bio : req.body.bio} , {new : true})

  user.dp = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

router.post("/upload", isLoggedIn,upload.single("postimage") ,async function(req , res) {
  const user = await userModel.findOne({username : req.session.passport.user});
  const post = await postModel.create({
    postimage : req.file.filename,
    posttext : req.body.posttext,
    user : user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/feed");
})

router.get("/username/:username" , isLoggedIn , async function(req , res) {
  const regex = new RegExp(`^$(req.params.username)` , "i");
  const users = await userModel.find({username : regex});
  res.json(users);
})

function isLoggedIn (req , res , next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
