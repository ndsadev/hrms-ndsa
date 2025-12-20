const User = require("../../models/User");

//  GET ALL USERS (SUPER ADMIN ONLY)
exports.getAllUsers = async (req, res) => {
  try {
    //  role comes from verifyAccessToken middleware
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const users = await User.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
