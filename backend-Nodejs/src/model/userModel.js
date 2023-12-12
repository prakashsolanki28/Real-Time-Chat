const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Make the email field unique
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        default: null, // Set the profile field to default to null
    },
});

userSchema.statics.findByEmail = async function (email) {
    return this.findOne({ email });
};

const User = mongoose.model('User', userSchema);

module.exports = User;