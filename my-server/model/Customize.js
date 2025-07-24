const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Customize = new Schema({
    name: { type: String },
    require: { type: Boolean },
    options: { type: Array },
    optionType: { type: String },
    productTypeId: { type: mongoose.Schema.Types.ObjectId},
    groupname: { type: String}
}, { collection: "customization"})

module.exports = mongoose.model('Customize', Customize)