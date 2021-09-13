const express = require("express");
const {
  setProfile,
  getProfile,
} = require("./../controllers/profileControllers");
const { protect } = require("./../controllers/authControllers");

const router = express.Router();

router.route("/").post(protect, setProfile).get(protect, getProfile);

module.exports = router;
