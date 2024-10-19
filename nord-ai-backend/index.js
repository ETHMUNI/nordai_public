const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var cors = require("cors");
const path = require("path");
const { stripeWebhook } = require("./controllers/stripe.controller");

require("dotenv-flow").config();

require("./routes/middlewares/mongo");

const app = express();

app.use(cors());

const port = 3080;

// app.use((req, res, next) => {
//   if (req.originalUrl === "/api/stripe/webhook") {
//     next();
//     // express.raw({ type: "application/json" }), next();
//   } else {
//     // bodyParser.json()(req, res, next);
//     express.json()(req, res, next);
//   }
// });

// app.use(
//   "/api/stripe/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhook
// );

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      const url = req.originalUrl;
      if (url.startsWith("/api/stripe/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the bodyParser middleware for application/x-www-form-urlencoded requests
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// right now it's running on bodyParser and it should run on api/stripe/webhook...
app.use(morgan("dev"));

//form-urlencoded
app.set("jwt", "ebeb1a5ada5cf38bfc2b49ed5b3100e0");

app.use("/api", require("./routes/api"));

// send hello world
app.get("/hello", (req, res) => {
  res.send("Hello World!, Api is working");
});

// Default Index Page
// app.use(express.static(__dirname + "/build"));
// Send all other items to index file
// app.get("*", (req, res) => res.sendFile(__dirname + "/build/index.html"));

// app.listen(process.env.PORT || port, () => {
//   console.log(`Server listening on port ${process.env.PORT || port}`);
// });

app.listen(process.env.PORT || port, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + port
    );
  else console.log("Error occurred, server can't start", error);
});
