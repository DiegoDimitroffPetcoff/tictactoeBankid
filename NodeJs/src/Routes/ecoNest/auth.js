const { Router } = require("express");
const http = require("https");
const fs = require('fs');
require('dotenv').config(); // Cargar las variables de entorno

const route = Router();

route.post("/econest/create-payment", async (req, res) => {
  const secretApiKey = process.env.SECRET_API_KEY; // Acceder a la variable de entorno
  const options = {
    method: "POST",
    hostname: "test.api.dibspayment.eu",
    port: 443,
    path: "/v1/payments",
    headers: {
      "content-type": "application/json",
      Authorization: secretApiKey,
    },
  };

  const restreq = http.request(options, function (resp) {
    const chunks = [];

    console.log("statusCode: ", resp.statusCode);
    console.log("headers: ", resp.headers);

    resp.on("data", function (chunk) {
      console.log("on data");
      chunks.push(chunk);
    });
    resp.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
      res.send(body.toString());
    });
  });

  let payload = fs.readFileSync(`${__dirname}/payload.json`);
  restreq.write(payload);

  restreq.on("error", function (e) {
    console.error("error");
    console.error(e);
  });
  restreq.end();
});

module.exports = route;
