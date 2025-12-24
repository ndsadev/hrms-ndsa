const PreboardingProfile = require("../../models/PreboardingProfile");

// ==================================================
// Helper: File Mapper
// ==================================================
const mapSingleFile = (file) => {
  if (!file) return null;
  return {
    url: file.path,
    publicId: file.filename,
  };
};

// ==================================================
// Helper: Safe JSON Parse
// ==================================================
const safeJsonParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    if (typeof value === "string") return JSON.parse(value);
    return value;
  } catch (err) {
    return fallback;
  }
};

// ==================================================
// ✅ UPDATE–1: REQUIRED FIELDS COMPLETION CHECK
// (Experience intentionally OPTIONAL)
// ==================================================
const isProfileComplete = (profile) => {
  const p = profile.personalDetails || {};
  const bank = profile.bankDetails || {};
  const emergency = profile.emergencyContact || {};

  // STEP 1 – Personal
  if (!p.firstName || !p.lastName || !p.dob || !p.email || !p.phone) {
    return false;
  }

  // STEP 2 – Education
  if (!profile.education?.length || !profile.education[0]?.qualification) {
    return false;
  }

  // STEP 3 – Certification
  if (!profile.certifications?.length || !profile.certifications[0]?.name) {
    return false;
  }

  // STEP 5 – Bank
  if (!bank.accountHolder || !bank.bankName || !bank.accountNo || !bank.ifsc) {
    return false;
  }

  // STEP 6 – Emergency ✅ FIXED
  if (!emergency.emergencyName || !emergency.emergencyPhone) {
    return false;
  }

  // STEP 4 – Experience OPTIONAL
  return true;
};

// ==================================================
// CREATE / UPDATE PREBOARDING PROFILE
// ==================================================
exports.savePreboardingProfile = async (req, res) => {
  try {
    console.log("========== PREBOARDING DEBUG START ==========");
    console.log("BODY KEYS:", Object.keys(req.body));
    console.log("FILES OBJECT:", req.files);
    console.log("===========================================");

    const userId = req.user._id;

    // SAFE PARSING
    const education = safeJsonParse(req.body.education, []);
    const certifications = safeJsonParse(req.body.certifications, []);
    const experiences = safeJsonParse(req.body.experiences, []);
    const bankDetails = safeJsonParse(req.body.bankDetails, null);
    const emergencyContact = safeJsonParse(req.body.emergencyContact, null);

    // Find or create profile
    let profile = await PreboardingProfile.findOne({
      employeeId: req.body.employeeId,
    });


    if (!profile) {
      profile = new PreboardingProfile({
        userId,                 // HR
        employeeId: req.body.employeeId, // EMPLOYEE (unique)
        createdBy: userId,
        status: "IN_PROGRESS",
      });
    }


    /* =========================
       STEP 1: PERSONAL DETAILS
    ========================== */
    profile.personalDetails = {
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      dob: req.body.dob,
      email: req.body.email,
      phone: req.body.phone,
      bloodGroup: req.body.bloodGroup,
      address: req.body.address,
      profilePic: req.files?.profilePic
        ? mapSingleFile(req.files.profilePic[0])
        : profile.personalDetails?.profilePic,
    };

    /* =========================
       STEP 2: EDUCATION
    ========================== */
    profile.education = education.map((edu) => ({
      qualification: edu.qualification,
      university: edu.university,
      passingYear: edu.passingYear,
      semesterResults: [],
    }));

    if (req.files?.semesterResults?.length && profile.education.length) {
      req.files.semesterResults.forEach((file, i) => {
        profile.education[0].semesterResults.push({
          semester: i + 1,
          file: mapSingleFile(file),
        });
      });
    }

    /* =========================
       STEP 3: CERTIFICATIONS
    ========================== */
    profile.certifications = certifications.map((cert, index) => ({
      name: cert.name,
      file: req.files?.certificationFile?.[index]
        ? mapSingleFile(req.files.certificationFile[index])
        : null,
    }));

    /* =========================
       STEP 4: EXPERIENCE (OPTIONAL)
    ========================== */
    profile.experiences = experiences.map((exp, index) => ({
      company: exp.company,
      designation: exp.designation,
      startDesignation: exp.startDesignation,
      endDesignation: exp.endDesignation,
      startDate: exp.startDate,
      endDate: exp.endDate,

      offerLetter: req.files?.offerLetter?.[index]
        ? mapSingleFile(req.files.offerLetter[index])
        : null,

      experienceLetter: req.files?.experienceLetter?.[index]
        ? mapSingleFile(req.files.experienceLetter[index])
        : null,

      appointmentLetter: req.files?.appointmentLetter?.[index]
        ? mapSingleFile(req.files.appointmentLetter[index])
        : null,

      salarySlip: req.files?.salarySlip?.[index]
        ? mapSingleFile(req.files.salarySlip[index])
        : null,
    }));

    /* =========================
       STEP 5: BANK DETAILS
    ========================== */
    if (bankDetails) {
      profile.bankDetails = {
        ...bankDetails,
        aadharFile: req.files?.aadharFile
          ? mapSingleFile(req.files.aadharFile[0])
          : profile.bankDetails?.aadharFile,

        panFile: req.files?.panFile
          ? mapSingleFile(req.files.panFile[0])
          : profile.bankDetails?.panFile,

        cancelCheque: req.files?.cancelCheque
          ? mapSingleFile(req.files.cancelCheque[0])
          : profile.bankDetails?.cancelCheque,
      };
    }

    /* =========================
       STEP 6: EMERGENCY CONTACT
    ========================== */
    if (emergencyContact) {
      profile.emergencyContact = emergencyContact;
    }

    /* =========================
       ✅ UPDATE–2: STATUS AUTO LOGIC
    ========================== */
    if (req.body.submit === "true") {
      profile.status = isProfileComplete(profile)
        ? "SUBMITTED"
        : "IN_PROGRESS";
    }

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Preboarding profile saved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("❌ Preboarding Error FULL:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while saving preboarding profile",
    });
  }
};

// ==================================================
// GET PREBOARDING PROFILE (LOGGED-IN USER)
// ==================================================
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch preboarding profile",
    });
  }
};
