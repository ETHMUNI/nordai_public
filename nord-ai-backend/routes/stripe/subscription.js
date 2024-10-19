const models = require("../models");
const User = models.user;

const subscription = async (eventType, data) => {
  if (!eventType.includes("subscription")) {
    return; // not a subscription event
  }

  console.log("subscription event detected", eventType);

  created(eventType, data);
  updated(eventType, data);
  deleted(eventType, data);
};

const created = async (eventType, data) => {
  //   console.log(JSON.stringify(data));
  if (!eventType.includes("subscription.created")) {
    return; // not a subscription event
  }
  const { object } = data;

  console.log(`object.status`, object.status);
  console.log(`object.id`, object.id);
  console.log(`Plan`, object.items.data[0].plan.nickname);
  console.log(`object.customer`, object.customer);
  console.log(`object.trial_end`, object.trial_end);
  console.log(`object.current_period_end`, object.current_period_end);
  console.log(`object.cancel_at_period_end`, object.cancel_at_period_end);

  const user = await User.findOne({ customerId: object.customer }).exec();

  console.log("User credit before the update at created: ", user.credits);

  await User.updateOne(
    { customerId: object.customer },
    {
      status: object.status,
      //   plan: object.items.data[0].plan.nickname,
      plan:
        object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_FREE
          ? "free"
          : object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_ENTRY
          ? "entry"
          : object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_PRO
          ? "pro"
          : "free",
      credits:
        object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_FREE &&
        object.status === "active"
          ? Number(user.credits + 5)
          : object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_ENTRY &&
            object.status === "active"
          ? Number(user.credits + 100)
          : object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_PRO &&
            object.status === "active"
          ? Number(user.credits + 250)
          : user.credits,
      trial_end: object.trial_end,
      current_period_end: object.current_period_end,
      cancel_at_period_end: object.cancel_at_period_end,
    }
  ).exec();

  const updatedUser = await User.findOne({
    customerId: object.customer,
  }).exec();

  console.log("User credit after the update at created: ", updatedUser.credits);
};

const updated = async (eventType, data) => {
  if (!eventType.includes("subscription.updated")) {
    return; // not a subscription event
  }
  const { object } = data;
  console.log(`object.status`, object.status);
  console.log(`object.id`, object.id);
  console.log(`object.customer`, object.customer);
  console.log(`object.trial_end`, object.trial_end);
  console.log(`object.current_period_end`, object.current_period_end);
  console.log(`object.cancel_at_period_end`, object.cancel_at_period_end);

  const user = await User.findOne({ customerId: object.customer }).exec();

  console.log("User credit before the update: ", user.credits);

  await User.updateOne(
    { customerId: object.customer },
    {
      status: object.status,
      //   plan: object.items.data[0].plan.nickname,
      plan:
        object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_FREE
          ? "free"
          : object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_ENTRY
          ? "entry"
          : object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_PRO
          ? "pro"
          : "N/A",
      credits:
        object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_FREE &&
        object.status === "active"
          ? Number(user.credits + 5)
          : object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_ENTRY &&
            object.status === "active"
          ? Number(user.credits + 100)
          : object.items.data[0].plan.id === process.env.STRIPE_PRODUCT_PRO &&
            object.status === "active"
          ? Number(user.credits + 250)
          : user.credits,
      trial_end: object.trial_end,
      current_period_end: object.current_period_end,
      cancel_at_period_end: object.cancel_at_period_end,
    }
  ).exec();

  const updatedUser = await User.findOne({
    customerId: object.customer,
  }).exec();

  console.log("User credit after the update: ", updatedUser.credits);
};

const deleted = async (eventType, data) => {
  if (!eventType.includes("subscription.deleted")) {
    return; // not a subscription event
  }
  const { object } = data;
  console.log(`object.status`, object.plan.status);
  console.log(`object.id`, object.id);
  console.log(`object.customer`, object.customer);
  console.log(`object.trial_end`, object.trial_end);
  console.log(`object.current_period_end`, object.current_period_end);
  console.log(`object.cancel_at_period_end`, object.cancel_at_period_end);

  await User.updateOne(
    { customerId: object.customer },
    {
      status: object.status,
      plan: "N/A",
      trial_end: object.trial_end,
      current_period_end: object.current_period_end,
      cancel_at_period_end: object.cancel_at_period_end,
    }
  ).exec();
};

module.exports = subscription;
