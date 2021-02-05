const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;

    // * validation
    if (!email || !password || !confirm_password) {
      return res.status(400).json({ error: "please enter all fileds" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be atleast 6 characters" });
    }

    if (confirm_password !== password) {
      return res.status(400).json({ error: "password does not match" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "account with this email already exists" });
    }

    //* hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //* save user in db
    const newUser = await new User({
      email,
      password: hashPassword,
    }).save();

    res.json(newUser);
  } catch (error) {
    console.error("register error:", error);
    res.status(500).send();
  }
};
