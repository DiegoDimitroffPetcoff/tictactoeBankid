const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const bankidApiUrlV5 = "https://appapi2.test.bankid.com/rp/v5.1/cancel";
const bankidApiUrlV6 = "https://appapi2.test.bankid.com/rp/v6.0/cancel";
const base64 = require("base-64");

const certPath = fs.readFileSync(
  path.join(__dirname, "../certificates/FPTestcert5_20240610.p12")
);
const cert = fs.readFileSync(
  path.join(__dirname, "../certificates/certificate.pem")
);
const key = fs.readFileSync(path.join(__dirname, "../certificates/key.pem"));
const password = "qwerty123";

async function cancelController(orderRef) {
  try {
    if (!bId) {
      return "no logged";
    }

    const requestBody = {
      orderRef: orderRef,
    };
    const httpsAgent = new https.Agent({
      /*    pfx: certPath, */
      cert: cert,
      key: key,
      passphrase: password,
      rejectUnauthorized: false,
    });

    await axios.post(bankidApiUrlV6, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
      httpsAgent: httpsAgent,
      timeout: 5000,
    });
    const response = { route_canceled: "/sign", orderRef: orderRef };
    return response;
  } catch (error) {
    console.error(
      "Error description:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
module.exports = cancelController;
