const stripe = require("../routes/middlewares/stripe");
const checkout = require("../routes/stripe/checkout");
const invoice = require("../routes/stripe/invoice");
const subscription = require("../routes/stripe/subscription");

const stripeWebhook = async (req, res) => {
  let data;
  let eventType;
  console.log("received webhook event call, ting ting...........");
  console.log(`webhook"]`, process.env.STRIPE_WEBHOOK_SECRET);
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    // console.log(`req.headers["stripe-signature"]`,req.headers["stripe-signature"])
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      console.log(err.message);
      return res.sendStatus(400);

      // response.status(400).send(`Webhook Error: ${err.message}`);
      // return;
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  checkout(eventType, data);
  subscription(eventType, data);
  invoice(eventType, data);

  if (eventType === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);
  }

  res.sendStatus(200);
};

module.exports = {
  stripeWebhook,
};
