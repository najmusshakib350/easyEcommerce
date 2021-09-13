const _ = require("lodash");
const { Category, validation } = require("./../models/category");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Product = require("./../models/product");

//Response
const Response = (res, statusCode, message, result) => {
  return res.status(statusCode).json({
    message: message,
    data: {
      result,
    },
  });
};

//create category
module.exports.createCategory = catchAsync(async (req, res, next) => {
  const { error } = validation(_.pick(req.body, ["name"]));
  if (error) {
    return next(new AppError(`${error.details[0].message}`, 400));
  }
  const category = new Category(_.pick(req.body, ["name"]));
  const result = category.save();
  Response(res, 201, "Category created successfully!!!", result.name);
});
//get category

module.exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({});
  Response(res, 200, "Success", categories);
});

//update category
module.exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new AppError("No Document found with that id", 404));
  }
  Response(res, 200, "Category Update successfully!!!", category);
});

//Delete category
module.exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError("No Document found with that id", 404));
  } else {
    const product = await Product.find({ category: req.params.id });
    product.forEach(async (el) => {
      await Product.findByIdAndDelete(el._id);
    });
  }
  Response(res, 200, "Document delete successfully!", "");
});
