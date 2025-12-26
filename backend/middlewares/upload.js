const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Clodinary Storage
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

    // DEFINE VARIABLES (IMPORTANT)
    const isImage = file.mimetype.startsWith("image/");
    const isPdf = file.mimetype === "application/pdf";
    const ext = path.extname(file.originalname);

    return {
      folder,

      // VERY IMPORTANT: use your custom preset
      upload_preset: "preboarding_docs",

      // Images + PDFs → image (Cloudinary preview works)
      // Docs/Excel → raw
      resource_type: isImage || isPdf ? "image" : "raw",

      // keep original extension
      public_id: `${file.fieldname}_${Date.now()}${ext}`,
    };
  },
});

// Allowed Type
const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",

  // Docs / PDFs
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// File Filter
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Allowed: jpg, png, webp, gif, pdf, doc, docx, xls, xlsx"
      ),
      false
    );
  }
  cb(null, true);
};

// Muster Instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Preboarding Fileds
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
