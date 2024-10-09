const { Router } = require("express");
const crypto = require("crypto");

const route = Router();

function generatePaylinkUrl(amount, currency, description) {
  const baseUrl = "https://pay.checkout.com/";
  const paymentId = crypto.randomBytes(16).toString("hex");
  return `${baseUrl}${paymentId}?amount=${amount}&currency=${currency}`;
}

route.post("/econest/create-paylink", (req, res) => {
  const { amount, currency, description } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Amount and currency are required" });
  }

  try {
    const paylinkUrl = generatePaylinkUrl(amount, currency, description);

    res.status(200).json({
      success: true,
      paylinkUrl: paylinkUrl,
      message: "Paylink URL generated successfully",
    });
  } catch (error) {
    console.error("Error generating Paylink URL:", error);
    res.status(500).json({ error: "Failed to generate Paylink URL" });
  }
});
module.exports = route;
