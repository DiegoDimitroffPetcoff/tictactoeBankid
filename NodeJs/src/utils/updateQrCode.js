const qrGenerator = require("./qrGenerator");

async function updateQRCode(data) {
  try {
    const qrCode = await qrGenerator(data);
    return qrCode;
  } catch (error) {
    throw new Error(`Error updating QR Code: ${error.message}`);
  }
}

module.exports = updateQRCode;
