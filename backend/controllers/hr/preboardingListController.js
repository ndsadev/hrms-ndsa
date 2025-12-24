const PreboardingProfile = require("../../models/PreboardingProfile");

// GET ALL PREBOARDING PROFILES (FOR TABLE)
//  employeeId | name | status
exports.getPreboardingList = async (req, res) => {
    try {
        const profiles = await PreboardingProfile.find()
            .select(
                "employeeId personalDetails.firstName personalDetails.lastName personalDetails.email status"
            )
            .sort({ createdAt: -1 });

        const data = profiles.map((p) => ({
            _id: p._id,
            employeeId: p.employeeId,
            name: `${p.personalDetails?.firstName || ""} ${p.personalDetails?.lastName || ""}`.trim(),
            email: p.personalDetails?.email || "",
            status: p.status,
        }));


        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("❌ Preboarding List Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch preboarding list",
        });
    }
};
