const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require("jsonwebtoken");
const brcypt = require('bcrypt');
const Product = require('./product');
const userSchema = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        minLength: [8, "Password Length 8 Char ..."],
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Email id is Not proper ....")
        }
    }
}, { timestamps: true });
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) user.password = await brcypt.hash(user.password, 8);
    next()
})
userSchema.statics.findUserValid = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User Not found ..")
    const isVerify = await brcypt.compare(password, user.password);
    if (!isVerify) throw new Error("Password not match ....")
    return user;
}
userSchema.methods.genrateToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, process.env.JSONTOKEN);
    return token;
}
userSchema.pre('deleteOne', async function (next) {
    const owner = this.getFilter()["_id"];

    const task = await Product.deleteMany({ productUserId: owner });
    next()
})
const User = mongoose.model("user", userSchema);
module.exports = User;