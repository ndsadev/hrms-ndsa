const express = require("express");
const router = express.Router();

const {createLaptopAsset} = require("../controllers/admin/laptop/createLaptopAsset");
const { getAllLaptopAssets } = require("../controllers/admin/laptop/getAllLaptopAssets");
const {laptopAssetUpload} = require("../middlewares/laptopAssetUpload");
const { verifyAccessToken } = require("../middlewares/verifyAccessToken");

router.post("/laptop", verifyAccessToken, laptopAssetUpload, createLaptopAsset);
router.get("/laptop/all", verifyAccessToken, getAllLaptopAssets);

module.exports = router;
