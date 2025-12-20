const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 🔥 FORCE STRING MATCH
    const user = await User.findById(decoded.id.toString()).select(
      "_id role name email"
    );

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "jwt expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};
