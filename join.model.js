const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    Password: {
        type: String
    }
});

module.exports = mongoose.model('Todo', Todo);