const { Router } = require("express");
const authController = require("../Controllers/authController");
const errorDescriptions = require("../utils/errorDescriptions");

const route = Router();

route.get("/", async (req, res) => {
  const userIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("se ejecuta /");

  try {
    bId = await authController(userIP);

    res.send(bId);
  } catch (error) {
    const errorResponde = errorDescriptions(error.message);
    res.status(500).send({
      errorCode: error.message,
      details: errorResponde,
    });
  }
});

module.exports = route;
