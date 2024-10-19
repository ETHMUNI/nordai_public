const db = require("../../models");
const User = db.user;

const updateWordCount = async (req, res, next) => {
  let user = await User.findOne({ _id: req.user._id });

  if (user && req.locals.outputLength) {
    user.wordCount += req.locals.outputLength;
  }

  user.save();

  next();
};

module.exports = updateWordCount;
