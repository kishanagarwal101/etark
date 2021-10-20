const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "can't be blank"],
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true,
        unique: [true, "Email already exists"],
    },
})
userSchema.pre("save", async function (next) {
    if (this.password) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
});

const userModel = new mongoose.model('userModel', userSchema);
module.exports = userModel;