const PreboardingProfile = require("../../models/PreboardingProfile");
const deleteFromCloudinary = require("../../utils/deleteFromCloudinary");

// Delete preboarding Profile (optimize)
exports.deletePreboardingProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const profile = await PreboardingProfile.findOne({ employeeId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Preboarding profile not found",
      });
    }

// Collect cloudinary deletes
    const deleteTasks = [];

    //  Profile Picture
    if (profile.personalDetails?.profilePic?.publicId) {
      deleteTasks.push(
        deleteFromCloudinary(profile.personalDetails.profilePic.publicId)
      );
    }

    //  Education → Semester Results
    profile.education?.forEach((edu) => {
      edu.semesterResults?.forEach((sem) => {
        if (sem.file?.publicId) {
          deleteTasks.push(deleteFromCloudinary(sem.file.publicId));
        }
      });
    });

    //  Certifications
    profile.certifications?.forEach((cert) => {
      if (cert.file?.publicId) {
        deleteTasks.push(deleteFromCloudinary(cert.file.publicId));
      }
    });

    // Experience Documents
    profile.experiences?.forEach((exp) => {
      ["offerLetter", "experienceLetter", "appointmentLetter", "salarySlip"].forEach(
        (key) => {
          if (exp[key]?.publicId) {
            deleteTasks.push(deleteFromCloudinary(exp[key].publicId));
          }
        }
      );
    });

    // Bank Documents
    ["aadharFile", "panFile", "cancelCheque"].forEach((key) => {
      if (profile.bankDetails?.[key]?.publicId) {
        deleteTasks.push(
          deleteFromCloudinary(profile.bankDetails[key].publicId)
        );
      }
    });

// Parallel Clodinary Delete
    await Promise.allSettled(deleteTasks);

// Delete Dtabase Record
    await profile.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Preboarding profile deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Preboarding Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete preboarding profile",
    });
  }
};
