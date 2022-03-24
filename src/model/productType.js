const mongoose = require('mongoose');
const productTypeSchema = mongoose.Schema({
    productType: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, { timestamps: true });
const ProductType = mongoose.model("productType", productTypeSchema);
module.exports = ProductType;