
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILLER_EMAIL|| 'gedeontwizeyimana@gmail.com',
    pass: process.env.NODEMAILLER_PASSWORD|| 'fqmv sapz olwh ltnm'
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: process.env.NODEMAILLER_EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
  });
}
