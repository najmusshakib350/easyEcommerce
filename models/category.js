const mongoose = require("mongoose");
const joi = require("joi");
const categoryschema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports.validation = (category) => {
  const schema = joi.object({
    name: joi.string().min(3).max(50).required(),
  });
  return schema.validate(category);
};

module.exports.Category = mongoose.model("Category", categoryschema);
