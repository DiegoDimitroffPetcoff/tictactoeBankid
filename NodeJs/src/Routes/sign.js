const { Router } = require("express");
const signController = require("../Controllers/signController.js");
const updateQRCode = require("../utils/updateQrCode.js");

const fs = require("fs");
const { swaggerDocs: v1SwaggerDocs } = require("../../swagger");
const qrGenerator = require("../utils/qrGenerator.js");
const route = Router();
let qrData;
let intervalId = null;
route.get("/sign", async (req, res) => {
  const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    const resp = await signController(bId, userIP);
    if (!resp) {
      return res.status(400).send("No se recibió respuesta de signController.");
    }
    qrData = await updateQRCode(resp);
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(async () => {
      try {
        qrData = await updateQRCode(resp);
        console.log(qrData.qrDataNoHash);
      } catch (error) {
        console.error("Error updating QR code:", error.message);
      }
    }, 1000); // Cada segundo

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(qrData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

route.get("/qr", (req, res) => {
  try {
    if (!qrData) {
      return res.status(404).send("El código QR no está disponible.");
    }
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(qrData.qrBase64c, "base64"));
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = route;
