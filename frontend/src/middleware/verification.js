import SibApiV3Sdk from "sib-api-v3-sdk";

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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"; // Replace with your Brevo API key

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
