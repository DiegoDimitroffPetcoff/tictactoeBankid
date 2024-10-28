const { Router } = require("express");
const authController = require("../Controllers/authController");
const errorDescriptions = require("../utils/errorDescriptions");
const cancelController = require("../Controllers/cancelController");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

const route = Router();
let orderRef;

// Configuración de certificados
const cert = fs.readFileSync(
  path.join(__dirname, "../certificates/certificate.pem")
);
const key = fs.readFileSync(path.join(__dirname, "../certificates/key.pem"));
const password = "qwerty123";

const httpsAgent = new https.Agent({
  cert: cert,
  key: key,
  passphrase: password,
  rejectUnauthorized: false,
});

route.get("/", async (req, res) => {
  const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const isMobile = /mobile|iphone|ipod|android/i.test(
    req.headers["user-agent"]
  );

  try {
    const bId = await authController(userIP);
    orderRef = bId.orderRef;

    // Construir la URL según el tipo de dispositivo
    let bankIdUrl;
    if (isMobile) {
      // URL para dispositivos móviles (iOS y Android)
      bankIdUrl = `https://app.bankid.com/?autostarttoken=${bId.autoStartToken}&redirect=null`;
    } else {
      // URL para desktop
      bankIdUrl = `bankid:///?autostarttoken=${bId.autoStartToken}&redirect=http://localhost:3001/`;
    }
console.log(bId);

    res.send({
      ...bId,
      bankIdUrl,
    });
  } catch (error) {
    const errorResponde = errorDescriptions(error.message);
    res.status(500).send({
      errorCode: error.message,
      details: errorResponde,
    });
  }
});

route.get("/cancel", async (req, res) => {
  try {
    console.log("/cancel");
    console.log(orderRef);

    if (!orderRef) {
      throw new Error(" There is no order ref");
    }
    const resp = await cancelController(orderRef, "/");
    if (!resp) {
      return res
        .status(400)
        .send("No se recibió respuesta de cancelController.");
    }
    res.status(200).send(resp);
  } catch (error) {
    const errorResponde = errorDescriptions(error.message);
    res.status(500).send({
      errorCode: error.message,
      details: errorResponde,
    });
  }
});

route.post("/auth", async (req, res) => {
  try {
    const response = await axios.post(
      "https://appapi2.test.bankid.com/rp/v5.1/auth",
      {
        personalNumber: req.body.personalNumber,
        endUserIp: req.ip,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_API_KEY}`,
        },
        httpsAgent: httpsAgent,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error al iniciar la autenticación" });
  }
});

route.post("/collect", async (req, res) => {
  try {
    const response = await axios.post(
      "https://appapi2.test.bankid.com/rp/v6.0/collect",
      {
        orderRef: req.body.orderRef,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_API_KEY}`,
        },
        httpsAgent: httpsAgent,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error al verificar la autenticación" });
  }
});

module.exports = route;
