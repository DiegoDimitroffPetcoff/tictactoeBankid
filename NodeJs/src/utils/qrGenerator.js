const QRCode = require("qrcode");
async function qrGenerator(resp) {
  if (!resp) {
    throw new Error("Erro on respond");
  }
  let qr = await QRCode.toDataURL(
    "qr_code.png",
    resp.qrStartToken,
    {
      color: { dark: "#000000", light: "#FFFFFF" },
      width: 400,
      margin: 1,
    },
    function (err) {
      if (err) throw new Error(err);
      console.log("QR Code generado y guardado como qr_code.png");
    }
  );
  return qr.split(",")[1];
}

module.exports = qrGenerator;
