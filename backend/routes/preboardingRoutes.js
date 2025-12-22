const express = require("express");
const router = express.Router();
const { preboardingUpload } = require("../middlewares/upload");
const {savePreboardingProfile,getPreboardingProfile} = require("../controllers/hr/preboardingController");
const { verifyAccessToken } = require("../middlewares/verifyAccessToken");

router.post("/preboarding", verifyAccessToken, preboardingUpload, savePreboardingProfile);
router.get("/preboarding", verifyAccessToken, getPreboardingProfile);

module.exports = router;
