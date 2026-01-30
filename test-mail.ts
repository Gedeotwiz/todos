import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILLER_EMAIL,
    pass: process.env.NODEMAILLER_PASSWORD,
  },
});

transporter.sendMail({
  from: process.env.NODEMAILLER_EMAIL,
  to: process.env.NODEMAILLER_EMAIL,
  subject: "Test",
  text: "Hello",
})
.then(() => console.log("SUCCESS"))
.catch(console.error);
