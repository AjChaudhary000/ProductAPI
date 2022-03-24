const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../model/product');
const ProductType = require('../model/productType');

const router = express.Router();
router.use(express.json());

router.post('/product', auth, async (req, res) => {
    try {
        const productTypeId = req.body.productTypeId;
        const type = await ProductType.findOne({ _id: productTypeId });
        if (!type) throw new Error("Product Type not match..")
        const productData = new Product({ productUserId: req.user._id, ...req.body });
        const product = await productData.save();
        if (!product) throw new Error("Product not insert ..")
        res.status(201).send({ message: "product inserted ...", data: product })
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
router.get('/product', auth, async (req, res) => {
    try {
        const product = await Product.find().populate("productUserId").populate("productTypeId").sort({ createdAt: -1 })
        if (product.length === 0) throw new Error("Product not found ..")
        res.status(200).send(product)
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
router.get('/product/type/:_id', auth, async (req, res) => {
    try {
        const product = await Product.find({ productTypeId: req.params._id })
            .populate("productUserId")
            .populate("productTypeId")

        if (product.length === 0) throw new Error("Product not found ..")
        res.status(200).send(product)
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
router.patch('/product/:_id', auth, async (req, res) => {
    const UpdateData = Object.keys(req.body);
    const CheckData = ["productName", "productPrice"];
    const validAction = UpdateData.every((update) => {
        return CheckData.includes(update)
    });
    if (!validAction) return res.status(400).send({ error: "not access.... " });
    try {
        const product = await Product.findByIdAndUpdate({ _id: req.params._id }, req.body, { new: true, runValidators: true });
        if (!product) throw new Error("Product not found ..")
        res.status(200).send({ message: "product updated ...", data: product })
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
router.delete('/product/:_id', auth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete({ _id: req.params._id });
        if (!product) throw new Error("Product not found ..")
        res.status(200).send({ message: "product deleted ...", data: product })
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})

router.post('/product/like/:_id', auth, async (req, res) => {
    try {
        const productData = await Product.findById({ _id: req.params._id });
        if (!productData) throw new Error("Product not found ..")
        const data = productData.productLikes.findIndex(item => item.likeUserId == (req.user._id).toString())
        if (data === -1) {
            productData.productLikes = productData.productLikes.concat({ likeUserId: req.user._id, isLikes: true })
        } else {
            const islike = productData.productLikes[data].isLikes;
            productData.productLikes[data].isLikes = !islike
        }
        const like = await productData.save();
        res.status(200).send({ message: `successful ${like.productLikes[0].isLikes ? " like " : "dislike "}` })
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
router.post('/product/comment/:_id', auth, async (req, res) => {
    try {
        const productData = await Product.findById({ _id: req.params._id });
        if (!productData) throw new Error("Product not found ..")
        productData.productComments = productData.productComments.concat({ commnetUserId: req.user._id, comments: req.body.comments })
        const comment = await productData.save();
        res.status(200).send({ message: "successful product comment  ...", data: comment })
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
router.get('/product/mostlikes', auth, async (req, res) => {
    try {
        const product = await Product.find();
        if (!product) throw new Error("Product not found ..")
        const mostlike = product.map((pro) => {
            return ({ pro, totalLikes: pro.productLikes.filter(item => item.isLikes === true).length })
        })
        mostlike.sort((a, b) => a.totalLikes < b.totalLikes ? 1 : -1);
        console.log("mostLike", mostlike);
        if (product.length === 0) throw new Error("Product not found ..")
        res.status(200).send(mostlike)
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
module.exports = router;