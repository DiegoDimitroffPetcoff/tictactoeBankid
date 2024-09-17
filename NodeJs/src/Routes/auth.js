const { Router } = require("express");
const authController = require("../Controllers/authController");
const errorDescriptions = require("../utils/errorDescriptions");
const cancelController = require("../Controllers/cancelController");

const route = Router();
let orderRef;
route.get("/", async (req, res) => {
  const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("se ejecuta /");

  try {
    bId = await authController(userIP);
    orderRef = bId.orderRef;
    res.send(bId);
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

module.exports = route;
