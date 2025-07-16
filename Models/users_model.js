const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    role: { type: String, required: false },
    createdAt: { type: Date },
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;