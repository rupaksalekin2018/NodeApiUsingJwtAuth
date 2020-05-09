const router = require("express").Router();

router.get("", (req, res) => {
    res.send('Welcome Home');
});

module.exports = router;