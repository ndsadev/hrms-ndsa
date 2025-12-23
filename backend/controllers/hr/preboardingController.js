const PreboardingProfile = require("../../models/PreboardingProfile");

// Helper
const mapSingleFile = (file) => {
  if (!file) return null;
  return {
    url: file.path,
    publicId: file.filename,
  };
};

// SAFE JSON PARSE (UPDATE–1)
const safeJsonParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    if (typeof value === "string") return JSON.parse(value);
    return value;
  } catch (err) {
    return fallback;
  }
};

//  CREATE / UPDATE PREBOARDING PROFILE
exports.savePreboardingProfile = async (req, res) => {
  try {
    console.log("========== PREBOARDING DEBUG START ==========");
    console.log("BODY KEYS:", Object.keys(req.body));
    console.log("FILES OBJECT:", req.files);
    console.log("===========================================");

    const userId = req.user._id;

    // UPDATE–1: SAFE PARSING
    const education = safeJsonParse(req.body.education, []);
    const certifications = safeJsonParse(req.body.certifications, []);
    const experiences = safeJsonParse(req.body.experiences, []);
    const bankDetails = safeJsonParse(req.body.bankDetails, null);
    const emergencyContact = safeJsonParse(req.body.emergencyContact, null);

    // Find or create profile
    let profile = await PreboardingProfile.findOne({ userId });

    if (!profile) {
      profile = new PreboardingProfile({
        userId,
        employeeId: req.body.employeeId,
        createdBy: userId,
      });
    }

    /* =========================
       STEP 1: PERSONAL DETAILS
    ========================== */
    console.log("PROFILE PIC FILE:", req.files?.profilePic);

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

    // ✅ Semester files
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
       STEP 4: EXPERIENCE
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
       STATUS
    ========================== */
    if (req.body.submit === "true") {
      profile.status = "SUBMITTED";
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

/* ==================================================
   GET PREBOARDING PROFILE
================================================== */
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
