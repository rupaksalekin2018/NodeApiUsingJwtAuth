const verify = require('./verifyToken')
const router = require("express").Router();

router.get("", verify, (req, res) => {

    res.json({
        posts: {
            title: 'my first post',
            description: 'random data with login access'
        },
        user: req.user
    });

    // res.send(req.user,);


});

module.exports = router;