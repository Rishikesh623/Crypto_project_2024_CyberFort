const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    about:{
        type : String
    }
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10); //take 10 no. of rounds for hashing
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
