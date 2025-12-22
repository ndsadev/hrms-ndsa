const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* -------------------------------
   Cloudinary Storage
-------------------------------- */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "preboarding/others";

    switch (file.fieldname) {
      case "profilePic":
        folder = "preboarding/profile";
        break;

      case "semesterResults":
        folder = "preboarding/education";
        break;

      case "certificationFile":
        folder = "preboarding/certifications";
        break;

      case "offerLetter":
      case "experienceLetter":
      case "appointmentLetter":
      case "salarySlip":
        folder = "preboarding/experience";
        break;

      case "aadharFile":
      case "panFile":
      case "cancelCheque":
        folder = "preboarding/bank";
        break;
    }

    return {
      folder,
      resource_type: "auto",
      public_id: `${file.fieldname}_${Date.now()}`,
    };
  },
});

/* -------------------------------
   Allowed File Types
-------------------------------- */
const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",

  // Docs
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel (optional)
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

/* -------------------------------
   File Filter
-------------------------------- */
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Allowed: jpg, png, webp, gif, pdf, doc, docx"
      ),
      false
    );
  }
  cb(null, true);
};

/* -------------------------------
   Multer Instance
-------------------------------- */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/* -------------------------------
   Preboarding Fields
-------------------------------- */
exports.preboardingUpload = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "semesterResults", maxCount: 10 },
  { name: "certificationFile", maxCount: 1 },

  { name: "offerLetter", maxCount: 1 },
  { name: "experienceLetter", maxCount: 1 },
  { name: "appointmentLetter", maxCount: 1 },
  { name: "salarySlip", maxCount: 1 },

  { name: "aadharFile", maxCount: 1 },
  { name: "panFile", maxCount: 1 },
  { name: "cancelCheque", maxCount: 1 },
]);
