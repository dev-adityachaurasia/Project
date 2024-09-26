import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config({});

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_KEY; // Replace with your Brevo API key

const otpVerify = (name, email, OTP) => {
  // Define the transactional email API instance
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  // Define your email data
  let sendSmtpEmail = {
    to: [
      {
        email: email, // Replace with recipient's email address
        name: name, // Optional recipient's name
      },
    ],
    sender: {
      email: "adityachaurasia14322@gmail.com", // Replace with your verified email address
      name: "Introduce", // Optional sender's name
    },
    subject: "Test email from Brevo",
    textContent: "OTP Verification Code !",
    htmlContent: `<strong>Hello , ${name} your OTP is <i>${OTP}</i></strong>`,
  };

  // Send the email
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      return true;
    },
    function (error) {
      return false;
    }
  );
};

export default otpVerify;
