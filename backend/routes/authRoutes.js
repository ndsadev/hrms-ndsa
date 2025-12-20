const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} = require("../controllers/user/authController");

const {
  getUserDetails,
} = require("../controllers/user/userDetailController"); 

const { verifyAccessToken } = require("../middlewares/verifyAccessToken");
const {getAllUsers} = require("../controllers/user/allUserController");
const {updateUserRole} = require("../controllers/user/updateUserRoleController");
const {deleteUser} = require("../controllers/user/deleteUserController");


router.post("/create-user", verifyAccessToken, createUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyAccessToken, logoutUser);
router.get("/me", verifyAccessToken, getUserDetails);
router.get("/all-users", verifyAccessToken, getAllUsers);
router.put("/update-user/:id", verifyAccessToken, updateUserRole);
router.delete("/delete-user/:userId", verifyAccessToken, deleteUser); 


module.exports = router;
