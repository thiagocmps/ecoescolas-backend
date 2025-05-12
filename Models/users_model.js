const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;