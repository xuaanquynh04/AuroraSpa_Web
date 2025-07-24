const mongoose = require('mongoose')
const Cartitem = require('./Cartitem')
const Schema = mongoose.Schema

const Bookingitem = new Schema({
    product: {type: Object},
    selectedTime: {type: Date}
})
module.exports = mongoose.model('Bookingitem', Bookingitem)