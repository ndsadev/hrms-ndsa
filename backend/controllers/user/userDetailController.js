const User = require("../../models/User");

//  GET LOGGED-IN USER DETAILS
exports.getUserDetails = async (req, res) => {
  try {
    // req.user.id comes from verifyAccessToken middleware
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user, // return full sanitized user object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
