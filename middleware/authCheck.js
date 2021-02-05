const jwt = require("jsonwebtoken");

exports.authCheck = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verified = jwt.verify(token, process.env.SECRET);

    req.user = verified.user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
