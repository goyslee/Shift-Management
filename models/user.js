var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    role: String, //Shift manager or Team manager
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false }, // v14
    isSuperAdmin: {type: Boolean, default: false },
    secretCode: String,
    time : { type : Date, default: Date.now },
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]

}, { usePushEach: true });
    


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

