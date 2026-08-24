const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({ //only email is added as a field because username and password are automatically added by passport-local-mongoose
    email : {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);//it automatically implement username, hashing, salting and hash password 

module.exports = mongoose.model('User', userSchema);