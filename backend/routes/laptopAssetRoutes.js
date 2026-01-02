const express = require("express");
const router = express.Router();

const {createLaptopAsset} = require("../controllers/admin/laptop/createLaptopAsset");
const {laptopAssetUpload} = require("../middlewares/laptopAssetUpload");
const { verifyAccessToken } = require("../middlewares/verifyAccessToken");

router.post("/laptop", verifyAccessToken, laptopAssetUpload, createLaptopAsset);

module.exports = router;
