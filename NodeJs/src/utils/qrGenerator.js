const QRCode = require("qrcode");
const crypto = require("crypto");

async function qrGenerator(data) {
  if (!data) {
    throw new Error("Error: No se proporcionaron los datos.");
  }
  const { orderRef, autoStartToken, qrStartToken, qrStartSecret, orderTime } =
    data;

  const currentTime = Math.floor(Date.now() / 1000);
  const qrTime = currentTime - orderTime;

  const hmac = crypto.createHmac("sha256", qrStartSecret);
  hmac.update(qrTime.toString());
  const qrAuthCode = hmac.digest("hex");

  const qrData = `bankid.${qrStartToken}.${qrTime}.${qrAuthCode}`;
  const qrDataNoHash = qrData;
  try {
    let qr = await QRCode.toDataURL(qrData, {
      color: { dark: "#000000", light: "#FFFFFF" },
      width: 400,
      margin: 1,
    });
    const allData = {
      orderRef,
      autoStartToken,
      qrStartToken,
      qrStartSecret,
      qrDataNoHash,

      qrBase64: qr,
      qrBase64c: qr.split(",")[1],
    };

    return allData;
  } catch (error) {
    throw new Error(`Error generating QR Code: ${err.message}`);
  }
}

module.exports = qrGenerator;
