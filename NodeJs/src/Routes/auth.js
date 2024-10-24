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
route.post('/auth', async (req, res) => {
  try {
    const response = await axios.post('https://appapi2.test.bankid.com/rp/v5.1/auth', {
      personalNumber: req.body.personalNumber,
      endUserIp: req.ip
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BANKID_API_KEY}`
      },
      httpsAgent: new https.Agent({
        cert: fs.readFileSync('path/to/your/certificate.pem'),
        key: fs.readFileSync('path/to/your/key.pem'),
        ca: fs.readFileSync('path/to/your/ca.pem')
      })
    })

    res.json(response.data)
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message)
    res.status(500).json({ error: 'Error al iniciar la autenticación' })
  }
})

// Ruta para verificar el estado de la autenticación
route.post('/collect', async (req, res) => {
  try {
    const response = await axios.post('https://appapi2.test.bankid.com/rp/v5.1/collect', {
      orderRef: req.body.orderRef
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BANKID_API_KEY}`
      },
      httpsAgent: new https.Agent({
        cert: fs.readFileSync('path/to/your/certificate.pem'),
        key: fs.readFileSync('path/to/your/key.pem'),
        ca: fs.readFileSync('path/to/your/ca.pem')
      })
    })

    res.json(response.data)
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message)
    res.status(500).json({ error: 'Error al verificar la autenticación' })
  }
})
module.exports = route;
