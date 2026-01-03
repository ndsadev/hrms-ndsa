const LaptopAsset = require("../../../models/LaptopAsset");

// GET ALL LAPTOP ASSETS
exports.getAllLaptopAssets = async (req, res) => {
  try {
    const assets = await LaptopAsset.find({ isActive: true })
      .populate("assignedTo", "name employeeId email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.error("❌ Get Laptop Assets Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch laptop assets",
    });
  }
};
