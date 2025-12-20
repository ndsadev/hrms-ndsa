const User = require("../../models/User");

// ===================================
// UPDATE USER (SUPER ADMIN ONLY)
// ===================================
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params; // ✅ URL PARAM
    const { role, name, designation } = req.body;

    // 🔐 Only SUPER ADMIN
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Super Admin only.",
      });
    }

    // ✅ Validate user id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ✅ Role validation
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "HR", "EMPLOYEE"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role value",
      });
    }

    // 🧠 Safe update payload
    const payload = {
      ...(name && { name }),
      ...(role && { role }),
      ...(designation && { designation }),
    };

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    // 🧠 Update DB
    const updatedUser = await User.findByIdAndUpdate(
      id,
      payload,
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
