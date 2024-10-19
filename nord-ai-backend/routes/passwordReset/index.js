const crypto = require("crypto");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const sendEmail = require("../../controllers/mailer");
const db = require("../models");
const User = db.user;
const Token = db.token;

const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("Bruger med følgende email findes ikke");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Nulstilling af adgangskode", link);

    res.send("Nulstillingslink til adgangskode er sendt til din e-mailkonto");
  } catch (error) {
    res.send("Der opstod en fejl");
    console.log(error);
  }
});

router.post("/:userId/:token", async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);

    // Check if req.body.password is at least 6 characters long
    if (!req.body.password || req.body.password.length < 6) {
      return res
        .status(400)
        .send("Adgangskoden skal være mindst 6 tegn lang");
    }
    console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("Ugyldigt link eller udløbet");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Ugyldigt link eller udløbet");

    user.password = bcrypt.hashSync(req.body.password, 8);
    await user.save();
    await token.delete();

    res.send("Adgangskoden blev nulstillet succesfuldt.");
  } catch (error) {
    res.send("Der opstod en fejl");
    console.log(error);
  }
});

module.exports = router;
