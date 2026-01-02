const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Clodinary storage (asset file)
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname);

    return {
      folder: "assets/laptop",
      resource_type: "image",
      public_id: `laptop_${Date.now()}_${Math.round(
        Math.random() * 1e9
      )}${ext}`,
    };
  },
});

// file filter image-only
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

// Multer Instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Multiple images
exports.laptopAssetUpload = upload.array("images", 5);
