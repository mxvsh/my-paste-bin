const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    id: { type: String, required: true },
    code: { type: String, required: true },
    user: { type: String, required: true },
    views: { type: Number, default: 1 },
    lang: String
});

module.exports = mongoose.model('Posts', Schema);
