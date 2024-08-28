const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const bankidApiUrlV5 = "https://appapi2.test.bankid.com/rp/v5.1/sign";
const bankidApiUrlV6 = "https://appapi2.test.bankid.com/rp/v6.0/sign";
const base64 = require("base-64");

const certPath = fs.readFileSync(
  path.join(__dirname, "../certificates/FPTestcert5_20240610.p12")
);
const cert = fs.readFileSync(
  path.join(__dirname, "../certificates/certificate.pem")
);
const key = fs.readFileSync(path.join(__dirname, "../certificates/key.pem"));
const password = "qwerty123";

async function signController(bId, userIP) {
  try {
    if (!bId) {
      return "no logged";
    }
    const userVisibleData = "Este es un ejemplo de texto para ser firmado";
    const userVisibleDataEncoded = base64.encode(userVisibleData);
    const { orderRef, autoStartToken, qrStartToken, qrStartSecret } = bId;

    const requestBody = {
      endUserIp: userIP,
   /*    orderRef: orderRef, */
      userVisibleData: userVisibleDataEncoded,
      requirement: {
        risk: "low",
      },
    };

    const httpsAgent = new https.Agent({
   /*    pfx: certPath, */
      cert: cert,
      key: key,
      passphrase: password,
      rejectUnauthorized: false,
    });

    const response = await axios.post(bankidApiUrlV6, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
      httpsAgent: httpsAgent,
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error description:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
module.exports = signController;
