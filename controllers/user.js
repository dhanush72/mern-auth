const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    // * jwt token
    const token = jwt.sign(
      {
        user: newUser._id,
      },
      process.env.SECRET
    );

    // * send token in cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();

    res.json(newUser);
  } catch (error) {
    console.error("register error:", error);
    res.status(500).send();
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // * validation
    if (!email || !password) {
      return res.status(400).json({ error: "please enter all fileds" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ error: "wrong email or password" });
    }

    const currentPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!currentPassword) {
      return res.status(401).json({ error: "wrong email or password" });
    }

    // * jwt token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.SECRET
    );

    // * send token in cookie
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (error) {
    console.error("login error:", error);
    res.status(500).send();
  }
};

exports.logout = async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
};
