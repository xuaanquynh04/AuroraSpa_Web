const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Bookingitem = require('./Bookingitem')

const Bookingform = new Schema({
    customerID: { type: String },
    customerName: { type: String },
    phone: { type: String },
    orderTime: { type: Date },
    bookingDate: { type: Date},
    paymentMethod: { type: String},
    total: {type: Number},
    status: { type: String },
    bookingItems: {type: Array}

}, { collection: "order"})

module.exports = mongoose.model('Bookingform', Bookingform)