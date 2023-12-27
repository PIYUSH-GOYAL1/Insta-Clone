const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/besan");

const userSchema = mongoose.Schema({
  username : String,
  fullname : String,
  password : String,
  email : String,
  dp : String,
  bio : String,
  posts : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "posts"
  }]
});

userSchema.plugin(plm);
module.exports = mongoose.model("users" , userSchema);