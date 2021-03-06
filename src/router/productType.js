const express = require('express');
const auth = require('../middleware/auth');
const ProductType = require('../model/productType');
const router = express.Router();
router.use(express.json());
router.post('/product/type', auth, async (req, res) => {
    try {
        const productTypeData = new ProductType(req.body);
        const type = await productTypeData.save();
        if (!type) return res.status(401).send({ error: "Product type not inserted .." })
        res.status(201).send(type)
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
router.get('/product/type', auth, async (req, res) => {
    try {

        const type = await ProductType.find();
        if (!type) return res.status(404).send({ error: "Product type not found .." })
        res.status(201).send(type)
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
module.exports = router