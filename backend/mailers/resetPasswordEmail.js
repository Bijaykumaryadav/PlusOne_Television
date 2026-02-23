const nodemailer = require("../config/nodemailer");
const ejs = require("ejs");
const path = require("path");

module.exports.resetPasswordEmail = async (user, otp) => {
  try {
    let emailHtml = await ejs.renderFile(
      path.join(__dirname, "../views/resetPasswordEmail.ejs"),
      { otp }
    );
    const options = {
      from: process.env.EMAIL,
      to: user.email,
      subject: `Reset Your password ${user.name}`,
      html: emailHtml,
    };
    await nodemailer.transporter.sendMail(options);
  } catch (error) {
    console.log(`Error in sending mail ${error}`);
  }
};