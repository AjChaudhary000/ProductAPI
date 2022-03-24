const express = require('express')
const app = express()
const port = process.env.PORT
const mongoose = require('mongoose');
const productRouter = require('./router/product');
const productTypeRouter = require('./router/productType');
const userRouter = require('./router/user');
mongoose.connect(process.env.MONGODB_URL)
app.use(userRouter)
app.use(productTypeRouter)
app.use(productRouter)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))