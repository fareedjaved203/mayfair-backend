const otpGenerator = require("otp-generator");

function generateOTP() {
  let OTP = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });
  return OTP;
}

module.exports = { generateOTP };
