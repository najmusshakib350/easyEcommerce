//Third party module
const express = require("express");
const {
  getAllProduct,
  aliasTopProducts,
  getProduct,
  uploadProductImages,
  resizeProductImages,
  updateProduct,
  deleteProduct,
  creatProduct,
  //testAggregation,
  // testVirtualprop,
  // testFind,
} = require("./../controllers/productControllers");
const { protect, restrictTo } = require("./../controllers/authControllers");
const reviewRouter = require("./reviewRouter");
// Mounting multiple router
const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopProducts, getAllProduct);

router
  .route("/")
  .get(getAllProduct)
  .post(protect, restrictTo("admin"), creatProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(
    protect,
    restrictTo("admin"),
    uploadProductImages,
    resizeProductImages,
    updateProduct
  )
  .delete(protect, restrictTo("admin"), deleteProduct);
module.exports = router;
