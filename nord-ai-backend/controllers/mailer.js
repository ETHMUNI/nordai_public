const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, link) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: process.env.HOST,
      service: process.env.SERVICE,
      // port: 587,
      // secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Nulstilling af din adgangskode",
      text: `Denne mail kan ikke besvares.\nDu kan nulstille din adgangskode ved at trykke på linket under:\n${link}`,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;
