const { Router } = require("express");
const collectController = require("../Controllers/collectController.js");
const errorDescriptions = require("../utils/errorDescriptions.js");

const route = Router();

route.get("/collect", async (req, res) => {
  try {
    const resp = await collectController(bId);

    res.send(resp);
  } catch (error) {
    const errorResponde = errorDescriptions(error.message);
    res.status(500).send({
      errorCode: error.message,
      details: errorResponde,
    });
  }
});
module.exports = route;
