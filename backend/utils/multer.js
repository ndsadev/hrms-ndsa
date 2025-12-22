const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/* -----------------------------------
   Cloudinary Storage
----------------------------------- */
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
      resource_type: "auto", // image / pdf / doc
      public_id: `${file.fieldname}_${Date.now()}`,
    };
  },
});

/* -----------------------------------
   ALLOWED FILE TYPES (EXTENDED)
----------------------------------- */
const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // (Optional Excel)
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

/* -----------------------------------
   File Filter
----------------------------------- */
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Invalid file type. Allowed: jpg, png, webp, pdf, doc, docx"
      ),
      false
    );
  }
  cb(null, true);
};

/* -----------------------------------
   Multer Instance
----------------------------------- */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;
