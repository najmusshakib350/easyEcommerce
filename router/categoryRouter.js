const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("./../controllers/categoryControllers");
const authController = require("./../controllers/authControllers");
const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    createCategory
  )
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    getCategories
  );
router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    updateCategory
  );
router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    deleteCategory
  );
module.exports = router;
