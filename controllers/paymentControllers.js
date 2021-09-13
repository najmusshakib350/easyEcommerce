const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { User } = require("./../models/people");
const catchAsync = require("./../utils/catchAsync");
const { Cart } = require("../models/cart");
const Profile = require("./../models/profile");
const Purchase = require("./../models/purchaseItems");
const factory = require("./handlerFactory");

module.exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const Items = await Cart.find({ user: userId });
  const profile = await Profile.findOne({ user: userId });
  //Product Name
  const allProductName = Items.map((item) => {
    return item.product.name;
  });
  //Product Id
  const allProductId = Items.map((item) => {
    return item.product._id;
  });

  const total_amount = Items.map((item) => item.count * item.price).reduce(
    (a, b) => a + b,
    0
  );
  //Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "alipay"],
    success_url: `${req.protocol}://${req.get("host")}/my-product`,
    cancel_url: `${req.protocol}://${req.get("host")}/my-whislist`,
    customer_email: req.user.email,
    client_reference_id: allProductId.join(" "),
    line_items: [
      {
        // name: allProductName.join(" "),
        // images: [
        //   `${req.protocol}://${req.get("host")}/img/products/${
        //     Items[0].product.imageCover
        //   }`,
        // ],
        // amount: total_amount * 100,
        // currency: "usd",
        price_data: {
          currency: "usd",
          product_data: {
            name: allProductName.join(" "),
            images: [
              `${req.protocol}://${req.get("host")}/img/products/${
                Items[0].product.imageCover
              }`,
            ],
          },
          unit_amount: total_amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
  });
  res.status(200).json({
    status: "success",
    session,
  });
});

const createPurchaseCheckout = async (session) => {
  const productStr = session.client_reference_id;
  const productArr = productStr.split(" ");
  // const user = (await User.findOne({ email: session.customer_email })).id;
  const user = (await User.findOne({ email: session.customer_details.email }))
    .id;
  // const price = session.line_items[0].amount / 100;
  const price = session.amount_total / 100;
  await Purchase.create({ productArr, user, price });
};

module.exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createPurchaseCheckout(event.data.object);

  res.status(200).json({ received: true });
};

module.exports.createPurchase = factory.createOne(Purchase);
module.exports.getPurchase = factory.getOne(Purchase);
module.exports.getAllPurchase = factory.getAll(Purchase);
module.exports.updatePurchase = factory.updateOne(Purchase);
module.exports.deletePurchase = factory.deleteOne(Purchase);
