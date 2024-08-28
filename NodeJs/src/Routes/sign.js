const { Router } = require("express");
const signController = require("../Controllers/signController.js");

const fs = require("fs");
const { swaggerDocs: v1SwaggerDocs } = require("../../swagger");
const qrGenerator = require("../utils/qrGenerator.js");
const route = Router();
let qrBase64;
route.get("/sign", async (req, res) => {
  const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    const resp = await signController(bId, userIP);
    qrBase64 = await qrGenerator(resp);
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(qrBase64);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
route.get("/qr", (req, res) => {
  try {
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(qrBase64, "base64"));
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = route;
