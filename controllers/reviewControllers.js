const Review = require("./../models/review");
const factory = require("./handlerFactory");
module.exports.setProductUserIds = (req, res, next) => {
  //Allow Nested Routes
  if (!req.body.product) req.body.product = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
module.exports.getAllReviews = factory.getAll(Review);
module.exports.getReview = factory.getOne(Review);
module.exports.CreatReview = factory.createOne(Review);
module.exports.updateReview = factory.updateOne(Review);
module.exports.deleteReview = factory.deleteOne(Review);
