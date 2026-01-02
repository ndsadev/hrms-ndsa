const LaptopAsset = require("../../../models/LaptopAsset");
const User = require("../../../models/User");

// Create Laptop Asset
exports.createLaptopAsset = async (req, res) => {
  try {
    const {
      company,
      model,
      serialNo,
      assetCode,
      assignedTo,
      officialEmail,
      employeeEmail,
      phoneNumber,
      remarks,
      purchaseDate,
      assetCondition,
      purchasedFrom,
      warranty,
      antivirusStart,
      antivirusEnd,
      ram,
      storage,
      processor,
    } = req.body;

// Required Check
    if (
      !company ||
      !assetCode ||
      !assignedTo ||
      !officialEmail ||
      !employeeEmail ||
      !phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

// Image Required
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one laptop image is required",
      });
    }

// Assigned user validation
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Assigned user not found",
      });
    }

// Unique Asset Code
    const existingAsset = await LaptopAsset.findOne({ assetCode });
    if (existingAsset) {
      return res.status(409).json({
        success: false,
        message: "Asset code already exists",
      });
    }

// Map files (files schema)
    const images = req.files.map(mapSingleFile);

// Create Asset
    const asset = await LaptopAsset.create({
      company,
      model,
      serialNo,
      assetCode,
      assignedTo,
      officialEmail,
      employeeEmail,
      phoneNumber,
      remarks,
      purchaseDate,
      assetCondition,
      purchasedFrom,
      warranty,
      antivirusStart,
      antivirusEnd,
      ram,
      storage,
      processor,
      images,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Laptop asset created successfully",
      data: asset,
    });
  } catch (error) {
    console.error("❌ Laptop Asset Create Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
