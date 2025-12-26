const express = require("express");
const router = express.Router();
const { preboardingUpload } = require("../middlewares/upload");
const {savePreboardingProfile,getPreboardingProfile} = require("../controllers/hr/preboardingController");
const {getPreboardingList} = require("../controllers/hr/preboardingListController");
const {getPreboardingProfileByEmployeeId} = require("../controllers/hr/preboardingViewController");
const {deletePreboardingProfile} = require("../controllers/hr/deletePreboardingProfileController");
const { verifyAccessToken } = require("../middlewares/verifyAccessToken");

router.post("/preboarding", verifyAccessToken, preboardingUpload, savePreboardingProfile);
router.get("/preboarding", verifyAccessToken, getPreboardingProfile);
router.get("/preboarding/all", verifyAccessToken, getPreboardingList);
router.get("/preboarding/view/:employeeId", verifyAccessToken, getPreboardingProfileByEmployeeId);
router.delete("/preboarding/delete/:employeeId", verifyAccessToken, deletePreboardingProfile);

module.exports = router;
