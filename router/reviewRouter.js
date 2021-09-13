const express = require("express");
const {
  getAllReviews,
  setProductUserIds,
  CreatReview,
  getReview,
  updateReview,
  deleteReview,
} = require("./../controllers/reviewControllers");
const { protect, restrictTo } = require("./../controllers/authControllers");

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setProductUserIds, CreatReview);

router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
