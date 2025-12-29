const PreboardingProfile = require("../../models/PreboardingProfile");

// ================================
// Helper: File Mapper
// ================================
const mapSingleFile = (file) => {
  if (!file) return null;
  return {
    url: file.path,
    publicId: file.filename,
  };
};

// ================================
// Helper: Safe JSON Parse
// ================================
const safeJsonParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    if (typeof value === "string") return JSON.parse(value);
    return value;
  } catch {
    return fallback;
  }
};

// ================================
// 🔥 FINAL PROFILE COMPLETION CHECK
// RULE: koi bhi field empty → IN_PROGRESS
// ================================
const isProfileComplete = (profileDoc) => {
  const profile = profileDoc.toObject({
    depopulate: true,
    versionKey: false,
  });

  // 🔕 fields / sections to IGNORE from validation
  const IGNORE_KEYS = [
    "_id",
    "createdBy",
    "createdAt",
    "updatedAt",
    "status",
    "userId",
    "__v",

    // 🔥 OPTIONAL SECTIONS
    "certifications",
    "experiences",
  ];

  const hasEmpty = (value, path = "") => {
    if (value === null || value === undefined) return true;

    if (typeof value === "string") {
      return value.trim() === "";
    }

    if (Array.isArray(value)) {
      // ✅ empty array allowed ONLY for optional sections
      if (value.length === 0) return false;
      return value.some((v) => hasEmpty(v, path));
    }

    if (typeof value === "object") {
      return Object.entries(value).some(([key, val]) => {
        if (IGNORE_KEYS.includes(key)) return false;
        return hasEmpty(val, key);
      });
    }

    return false;
  };

  return !hasEmpty(profile);
};

// ================================
// CREATE / UPDATE PREBOARDING PROFILE
// ================================
exports.savePreboardingProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // ================================
    // FILES MAP
    // ================================
    const filesMap = {};
    (req.files || []).forEach((file) => {
      if (!filesMap[file.fieldname]) {
        filesMap[file.fieldname] = [];
      }
      filesMap[file.fieldname].push(file);
    });

    // ================================
    // SAFE PARSING
    // ================================
    const education = safeJsonParse(req.body.education, []);
    const certifications = safeJsonParse(req.body.certifications, []);
    const experiences = safeJsonParse(req.body.experiences, []);
    const bankDetails = safeJsonParse(req.body.bankDetails, null);
    const emergencyContact = safeJsonParse(req.body.emergencyContact, null);

    // ================================
    // FIND OR CREATE PROFILE
    // ================================
    let profile = await PreboardingProfile.findOne({
      employeeId: req.body.employeeId,
    });

    if (!profile) {
      profile = new PreboardingProfile({
        userId,
        employeeId: req.body.employeeId,
        createdBy: userId,
        status: "IN_PROGRESS",
      });
    }

    // ================================
    // STEP 1: PERSONAL DETAILS
    // ================================
    profile.personalDetails = {
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      dob: req.body.dob,
      email: req.body.email,
      phone: req.body.phone,
      bloodGroup: req.body.bloodGroup,
      address: req.body.address,
      profilePic: filesMap.profilePic
        ? mapSingleFile(filesMap.profilePic[0])
        : profile.personalDetails?.profilePic,
    };

    // ================================
    // STEP 2: EDUCATION (RETAIN OLD FILES)
    // ================================
    profile.education = education.map((edu, index) => ({
      qualification: edu.qualification,
      university: edu.university,
      passingYear: edu.passingYear,
      semesterResults: profile.education?.[index]?.semesterResults || [],
    }));

    Object.keys(filesMap).forEach((key) => {
      if (key.startsWith("semesterResults_")) {
        const eduIndex = Number(key.split("_")[1]);
        if (profile.education[eduIndex]) {
          filesMap[key].forEach((file, i) => {
            profile.education[eduIndex].semesterResults.push({
              semester: i + 1,
              file: mapSingleFile(file),
            });
          });
        }
      }
    });

    // ================================
    // STEP 3: CERTIFICATIONS (RETAIN OLD)
    // ================================
    profile.certifications = certifications.map((cert, index) => ({
      name: cert.name,
      file: filesMap.certificationFile?.[index]
        ? mapSingleFile(filesMap.certificationFile[index])
        : profile.certifications?.[index]?.file || null,
    }));

    // ================================
    // STEP 4: EXPERIENCE (RETAIN OLD)
    // ================================
    profile.experiences = experiences.map((exp, index) => ({
      company: exp.company,
      designation: exp.designation,
      startDesignation: exp.startDesignation,
      endDesignation: exp.endDesignation,
      startDate: exp.startDate,
      endDate: exp.endDate,

      offerLetter: filesMap.offerLetter?.[index]
        ? mapSingleFile(filesMap.offerLetter[index])
        : profile.experiences?.[index]?.offerLetter || null,

      experienceLetter: filesMap.experienceLetter?.[index]
        ? mapSingleFile(filesMap.experienceLetter[index])
        : profile.experiences?.[index]?.experienceLetter || null,

      appointmentLetter: filesMap.appointmentLetter?.[index]
        ? mapSingleFile(filesMap.appointmentLetter[index])
        : profile.experiences?.[index]?.appointmentLetter || null,

      salarySlip: filesMap.salarySlip?.[index]
        ? mapSingleFile(filesMap.salarySlip[index])
        : profile.experiences?.[index]?.salarySlip || null,
    }));

    // ================================
    // STEP 5: BANK DETAILS
    // ================================
    if (bankDetails) {
      profile.bankDetails = {
        ...bankDetails,
        aadharFile: filesMap.aadharFile
          ? mapSingleFile(filesMap.aadharFile[0])
          : profile.bankDetails?.aadharFile,

        panFile: filesMap.panFile
          ? mapSingleFile(filesMap.panFile[0])
          : profile.bankDetails?.panFile,

        cancelCheque: filesMap.cancelCheque
          ? mapSingleFile(filesMap.cancelCheque[0])
          : profile.bankDetails?.cancelCheque,
      };
    }

    // ================================
    // STEP 6: EMERGENCY CONTACT
    // ================================
    if (emergencyContact) {
      profile.emergencyContact = emergencyContact;
    }

    // ================================
    // 🔥 STATUS AUTO UPDATE (FINAL)
    // ================================
    profile.status = isProfileComplete(profile)
      ? "SUBMITTED"
      : "IN_PROGRESS";

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Preboarding profile saved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("❌ Preboarding Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ================================
// GET PREBOARDING PROFILE
// ================================
exports.getPreboardingProfile = async (req, res) => {
  try {
    const profile = await PreboardingProfile.findOne({
      userId: req.user._id,
    }).populate("createdBy", "name email role");

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
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch preboarding profile",
    });
  }
};
