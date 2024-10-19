const express = require("express");
const openai = require("../middlewares/openai");
const {
  initMiddleware,
  creditCheck,
  contentFilterCheck,
  sendResponse,
  creditPayment,
  saveToHistory,
  updateWordCount,
} = require("./middleware");

let app = express.Router();

app.use("/", initMiddleware, creditCheck);

app.use("/", require("./summarize"));
app.use("/", require("./code/interpret"));
app.use("/", require("./writing/intro"));
app.use("/", require("./jobad"));
app.use("/", require("./helloworld"));
app.use("/", require("./example"));
app.use("/", require("./youtubetitle"));
app.use("/", require("./youtubescripts"));
app.use("/", require("./youtubetags"));
app.use("/", require("./youtuberesponder"));
app.use("/", require("./youtubedescription"));
app.use("/", require("./youtubeidea"));
app.use("/", require("./twitterthreads"));
app.use("/", require("./linkedinpost"));
app.use("/", require("./linkedinads"));
app.use("/", require("./facebookheadline"));
app.use("/", require("./facebooktext"));
app.use("/", require("./facebookretarget"));
app.use("/", require("./googleheadline"));
app.use("/", require("./googledesc"));
app.use("/", require("./emailcold"));
app.use("/", require("./emailfollowup"));
app.use("/", require("./emailsubjectline"));
app.use("/", require("./emailnewsletter"));

app.use("/", contentFilterCheck);
app.use("/", creditPayment);
app.use("/", saveToHistory);
app.use("/", updateWordCount);

app.use("/", sendResponse);

module.exports = app;
