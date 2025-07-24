const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Option = new Schema({
    value: {type: String},
    name: {type: String},
    addPrice: {type: Number}
})

module.exports = mongoose.model('Option', Option)