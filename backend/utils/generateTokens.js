const jwt = require("jsonwebtoken");

// ======================
// ACCESS TOKEN
// ======================
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(), // 🔥 FORCE STRING
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};


// ======================
// REFRESH TOKEN
// ======================
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
