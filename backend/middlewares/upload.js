const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ================================
// CLOUDINARY STORAGE
// ================================
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "preboarding/others";

    if (file.fieldname === "profilePic") {
      folder = "preboarding/profile";
    } else if (file.fieldname.startsWith("semesterResults")) {
      folder = "preboarding/education";
    } else if (file.fieldname === "certificationFile") {
      folder = "preboarding/certifications";
    } else if (
      ["offerLetter", "experienceLetter", "appointmentLetter", "salarySlip"].includes(
        file.fieldname
      )
    ) {
      folder = "preboarding/experience";
    } else if (
      ["aadharFile", "panFile", "cancelCheque"].includes(file.fieldname)
    ) {
      folder = "preboarding/bank";
    }

    const isImage = file.mimetype.startsWith("image/");
    const isPdf = file.mimetype === "application/pdf";
    const ext = path.extname(file.originalname);

    return {
      folder,
      upload_preset: "preboarding_docs",
      resource_type: isImage || isPdf ? "image" : "raw",
      public_id: `${file.fieldname}_${Date.now()}${ext}`,
    };
  },
});

// ================================
// FILE FILTER
// ================================
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
};

// ================================
// MULTER INSTANCE
// ================================
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ✅ IMPORTANT
exports.preboardingUpload = upload.any();
