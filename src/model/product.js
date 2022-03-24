const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    productTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productType",
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
        trim: true,

    },
    productDescripation: {
        type: String,
        trim: true
    },
    productLikes: [
        {
            likeUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            isLikes: {
                type: Boolean
            }
        }
    ],
    productComments: [
        {
            commnetUserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            comments: {
                type: String
            }
        }
    ],
    productUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }

}, { timestamps: true });
const Product = mongoose.model("products", productSchema);
module.exports = Product;
