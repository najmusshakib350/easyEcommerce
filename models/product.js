const mongoose = require("mongoose");
const joi = require("joi");
const validator = require("validator");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      unique: true,
      maxlength: [
        40,
        "A product name must have less or equal then 40 characters",
      ],
      minlength: [
        10,
        "A product name must have more or equal then 10 characters",
      ],
      // validate: [validator.isAlpha, 'Tour name must contain character'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be bellow 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
//Indexs Concept

productSchema.index({ price: 1, ratingsAverage: -1 });

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});
//virtual populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

//Testing aggregation Middleware
// productSchema.pre("aggregate", async function (next) {
//   const arr = await this.find({});
//   console.log(arr);
//   return next();
// });
// const validateUser = (product) => {
//   const schema = joi.object({
//     name: joi.string().min(3).max(255).required(),
//     description: joi.string().max(2000).required(),
//     price: joi.number().required(),
//     quantity: joi.number().required(),
//     category: joi.string().required(),
//   });
//   return schema.validate(product);
// };

// module.schema.validate = validateUser;
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
