const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation
} = require("../validation");

router.post("/register", async (req, res) => {
  ////Validating the Data
  const validate = registerValidation(req.body);
  // res.send(validate.error);

  if (validate.error) {
    return res.status(400).send(validate.error.details[0].message);
  } else {
    //Checking if the user is already in the database
    const emailExist = await User.findOne({
      email: req.body.email,
    });
    if (emailExist) return res.status(400).send("Email already Exist");

    //Hashing the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      const savedUser = await user.save();
      res.send({
        user: user._id
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

router.post("/login", async (req, res) => {
  ////Validating the Data
  const validate = loginValidation(req.body);
  // res.send(validate.error);

  if (validate.error) {
    return res.status(400).send(validate.error.details[0].message);
  }

  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send("Email Does Not Exist");
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  //Create and assign a token
  const token = jwt.sign({
    _id: user._id
  }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});
module.exports = router;