const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/besan");

const postSchema = mongoose.Schema({
    postimage : String,
    posttext : String,
    createdAt : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    }]
});

module.exports = mongoose.model("posts" , postSchema);
