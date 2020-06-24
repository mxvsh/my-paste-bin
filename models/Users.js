const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String },
    isAuth: Boolean
});

Schema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('Users', Schema);
