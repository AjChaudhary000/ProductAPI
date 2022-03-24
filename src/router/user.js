const express = require('express');
const auth = require('../middleware/auth');
const User = require('../model/user');
const router = express.Router();
router.use(express.json());

router.post('/user', async (req, res) => {
    try {
        const UserData = new User(req.body);
        const data = await UserData.save();
        !data && res.status(404).send("User Not Reg ..")
        res.status(201).send(data)
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
router.post('/user/login', async (req, res) => {
    try {

        const data = await User.findUserValid(req.body.email, req.body.password)
        const token = await data.genrateToken();
        !data && res.status(404).send("User Not Found ..")
        res.status(200).send({ data, token })
    } catch (e) {
        res.status(400).send({ error: e.toString() })
    }
})
router.get('/user/me', auth, async (req, res) => {
    try {

        res.send(req.user)
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
router.delete('/user/me',auth, async (req, res) => {
    try {
        const user = await User.deleteOne({ _id: req.user._id });
        if (!user) return res.status(404).send("User data Not Found ")
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send({ error: e.message.toString() })
    }
})
module.exports = router;