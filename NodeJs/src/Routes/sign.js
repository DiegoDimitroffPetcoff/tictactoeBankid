const { Router } = require("express");
const signController = require("../Controllers/signController.js");
const cancelController = require("../Controllers/cancelController.js");
const updateQRCode = require("../utils/updateQrCode.js");
const errorDescriptions = require("../utils/errorDescriptions.js");
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
      } catch (error) {
        console.error("Error updating QR code:", error.message);
      }
    }, 1000); 

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(qrData);
  } catch (error) {
    const errorResponde = errorDescriptions(error.message)
    res.status(500).send({
      errorCode: error.message,
      details: errorResponde,
    });
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
    const errorResponde = errorDescriptions(error.message)
    res.status(500).send({
      errorCode: error.message,
      details: errorResponde,
    });
  }
});

route.get("/sign/cancel", async (req, res) => {
  try {
    if (!qrData.orderRef) {
      throw new Error(" There is no order ref");
    }
    const resp = await cancelController(qrData.orderRef, "/sign");
    if (!resp) {
      return res
        .status(400)
        .send("No se recibió respuesta de cancelController.");
    }
    res.status(200).send(resp);
  } catch (error) {
    const errorResponde = errorDescriptions(error.message)
    res.status(500).send({
      errorCode: error.message,
      details: errorResponde,
    });
  }
});
module.exports = route;
