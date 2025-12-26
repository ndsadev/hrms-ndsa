const PreboardingProfile = require("../../models/PreboardingProfile");

/**
 * GET SINGLE PREBOARDING PROFILE (FULL DATA)
 * Used for VIEW / EDIT
 */
exports.getPreboardingProfileByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const profile = await PreboardingProfile.findOne({ employeeId })
      .populate("createdBy", "name email role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Preboarding profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile, 
    });
  } catch (error) {
    console.error("❌ Preboarding View Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch preboarding profile",
    });
  }
};
