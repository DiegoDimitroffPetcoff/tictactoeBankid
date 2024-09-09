const { Router } = require("express");
const authPhoneController = require("../Controllers/authPhoneController");
const errorDescriptions = require("../utils/errorDescriptions");
const cancelController = require("../Controllers/cancelController");

const route = Router();
let orderRef = null;

route.post("/phone", async (req, res) => {
  const personalNumber = "190000000000";
  try {
    const response = await authPhoneController(personalNumber);
    orderRef = response.orderRef;
    res.status(200).send(response);
  } catch (error) {
    const errorResponde = errorDescriptions(error.message);
    res.status(500).send({
      errorCode: error.message,
      details: errorResponde,
    });
  }
});

route.get("/phone/cancel", async (req, res) => {
  try {
    if (!orderRef) {
      throw new Error(" There is no order ref");
    }
    const resp = await cancelController(orderRef, "/phone");
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
