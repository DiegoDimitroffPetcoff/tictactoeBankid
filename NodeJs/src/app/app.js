const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const authRoute = require("../Routes/auth.js");
const collectRoute = require("../Routes/collect.js");
const signRoute = require("../Routes/sign.js");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(authRoute);
app.use(collectRoute);
app.use(signRoute);

module.exports = app;
