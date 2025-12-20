const User = require("../../models/User");

// ===================================
// DELETE USER (SUPER ADMIN ONLY)
// ===================================
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔐 Only SUPER ADMIN
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super Admin only.",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 🔥 Prevent self delete
    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
