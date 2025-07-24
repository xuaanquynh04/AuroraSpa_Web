const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Feedbackhome = new Schema({
    productID: {  type: mongoose.Schema.Types.ObjectId },
    customerID: {  type: mongoose.Schema.Types.ObjectId },
    content: { type: String },
    rating: { type: Number },
    date: { type: Date }
}, { collection: "feedback"})

module.exports = mongoose.model('Feedbackhome', Feedbackhome)