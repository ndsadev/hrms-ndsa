const PreboardingProfile = require("../../models/PreboardingProfile");

/* --------------------------------------------------
   Helper: Map single Cloudinary file
-------------------------------------------------- */
const mapSingleFile = (file) => {
  if (!file) return null;
  return {
    url: file.path,
    publicId: file.filename,
  };
};

/* --------------------------------------------------
   Helper: Map multiple Cloudinary files
-------------------------------------------------- */
const mapMultipleFiles = (files) => {
  if (!files || !files.length) return [];
  return files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));
};

/* ==================================================
   CREATE / UPDATE PREBOARDING PROFILE (STEP-WISE)
================================================== */
exports.savePreboardingProfile = async (req, res) => {
  try {
    const userId = req.user._id;

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
    if (req.body.firstName) {
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
    }

    /* =========================
       STEP 2: EDUCATION
    ========================== */
    if (req.body.qualification) {
      const semesterResults = req.files?.semesterResults
        ? req.files.semesterResults.map((file, index) => ({
            semester: index + 1,
            file: mapSingleFile(file),
          }))
        : [];

      profile.education.push({
        qualification: req.body.qualification,
        university: req.body.university,
        passingYear: req.body.passingYear,
        semesterResults,
      });
    }

    /* =========================
       STEP 3: CERTIFICATIONS
    ========================== */
    if (req.body.certificationName) {
      profile.certifications.push({
        name: req.body.certificationName,
        file: req.files?.certificationFile
          ? mapSingleFile(req.files.certificationFile[0])
          : null,
      });
    }

    /* =========================
       STEP 4: EXPERIENCE
    ========================== */
    if (req.body.company) {
      profile.experiences.push({
        company: req.body.company,
        designation: req.body.designation,
        startDesignation: req.body.startDesignation,
        endDesignation: req.body.endDesignation,
        startDate: req.body.startDate,
        endDate: req.body.endDate,

        offerLetter: req.files?.offerLetter
          ? mapSingleFile(req.files.offerLetter[0])
          : null,

        experienceLetter: req.files?.experienceLetter
          ? mapSingleFile(req.files.experienceLetter[0])
          : null,

        appointmentLetter: req.files?.appointmentLetter
          ? mapSingleFile(req.files.appointmentLetter[0])
          : null,

        salarySlip: req.files?.salarySlip
          ? mapSingleFile(req.files.salarySlip[0])
          : null,
      });
    }

    /* =========================
       STEP 5: BANK DETAILS
    ========================== */
    if (req.body.accountHolder) {
      profile.bankDetails = {
        accountHolder: req.body.accountHolder,
        bankName: req.body.bankName,
        branch: req.body.branch,
        bankEmail: req.body.bankEmail,
        bankPhone: req.body.bankPhone,
        accountNo: req.body.accountNo,
        ifsc: req.body.ifsc,
        registerNo: req.body.registerNo,

        aadharNo: req.body.aadharNo,
        aadharFile: req.files?.aadharFile
          ? mapSingleFile(req.files.aadharFile[0])
          : profile.bankDetails?.aadharFile,

        panNo: req.body.panNo,
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
    if (req.body.emergencyName) {
      profile.emergencyContact = {
        name: req.body.emergencyName,
        relation: req.body.relation,
        phone: req.body.emergencyPhone,
        alternatePhone: req.body.emergencyAlternatePhone,
        address: req.body.emergencyAddress,
      };
    }

    // Status update
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
    console.error("Preboarding Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while saving preboarding profile",
    });
  }
};

/* ==================================================
   GET PREBOARDING PROFILE (HR / USER)
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
