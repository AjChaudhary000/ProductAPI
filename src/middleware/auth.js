const User = require("../model/user");
const jwt = require('jsonwebtoken');
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, process.env.JSONTOKEN);
        const user = await User.findOne({ _id: decode._id })
        if (!user) throw new Error();
        req.user = user;
        next()
    } catch (e) {
        res.status(401).send({ error: 'please authenticate.' })
    }
}
module.exports = auth