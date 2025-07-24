const mongoose = require('mongoose')
const Product = require('./Product')
const Option = require('./Option')
const Schema = mongoose.Schema

const Cartitem = new Schema({
    product: { type: Object},
    quantity: {type: Number},
    selectedOptions: {type: Array},
    itemPrice: { type: Number }
})

module.exports = mongoose.model('Cartitem', Cartitem)