const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  product: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Purchase must belong to a Product!"],
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Purchase must belong to a User!"],
  },
  price: {
    type: Number,
    require: [true, "Purchase must have a price."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "product",
    select: "name",
  });
  next();
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;