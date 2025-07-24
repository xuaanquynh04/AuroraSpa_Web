const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    productType: {  type: mongoose.Schema.Types.ObjectId },
    creatorID: { type: Number },
    productName: { type: String },
    price: { type: Number },
    description: { type: String },
    duration: { type: Number },
    image: { type: String },
    new: { type: Boolean},
    rating: { type: Number}
}, { collection: "products"})

module.exports = mongoose.model('Product', Product)