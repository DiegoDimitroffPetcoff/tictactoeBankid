const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const shops = new Map();

router.post("/econest/create-paylink/create", (req, res) => {
  const { shopName, brandColors, items, paymentMethods } = req.body;

  if (!shopName || !items || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Shop name and at least one item are required" });
  }

  const shopId = crypto.randomBytes(8).toString("hex");
  const shop = {
    id: shopId,
    name: shopName,
    brandColors: brandColors || { primary: "#000000", secondary: "#ffffff" },
    items: items,
    paymentMethods: paymentMethods || ["visa", "mastercard", "paypal"],
    createdAt: new Date().toISOString(),
  };

  shops.set(shopId, shop);

  res.status(201).json({
    success: true,
    message: "One-Page-Shop created successfully",
    shop: {
      id: shop.id,
      name: shop.name,
      url: `https://checkout.com/one-page-shop/${shop.id}`,
      modalCode: `<button onclick="window.open('https://checkout.com/one-page-shop/${shop.id}', 'One-Page-Shop', 'width=600,height=400')">Open Shop</button>`,
      iframeCode: `<iframe src="https://checkout.com/one-page-shop/${shop.id}" width="100%" height="600" frameborder="0"></iframe>`,
    },
  });
});

router.get("/econest/:shopId", (req, res) => {
  const { shopId } = req.params;
  const shop = shops.get(shopId);

  if (!shop) {
    return res.status(404).json({ error: "Shop not found" });
  }

  res.json({
    success: true,
    shop: {
      id: shop.id,
      name: shop.name,
      brandColors: shop.brandColors,
      items: shop.items,
      paymentMethods: shop.paymentMethods,
      url: `https://checkout.com/one-page-shop/${shop.id}`,
      modalCode: `<button onclick="window.open('https://checkout.com/one-page-shop/${shop.id}', 'One-Page-Shop', 'width=600,height=400')">Open Shop</button>`,
      iframeCode: `<iframe src="https://checkout.com/one-page-shop/${shop.id}" width="100%" height="600" frameborder="0"></iframe>`,
    },
  });
});

router.put("/econest/:shopId", (req, res) => {
  const { shopId } = req.params;
  const { shopName, brandColors, items, paymentMethods } = req.body;
  const shop = shops.get(shopId);

  if (!shop) {
    return res.status(404).json({ error: "Shop not found" });
  }

  shop.name = shopName || shop.name;
  shop.brandColors = brandColors || shop.brandColors;
  shop.items = items || shop.items;
  shop.paymentMethods = paymentMethods || shop.paymentMethods;

  shops.set(shopId, shop);

  res.json({
    success: true,
    message: "One-Page-Shop updated successfully",
    shop: {
      id: shop.id,
      name: shop.name,
      url: `https://checkout.com/one-page-shop/${shop.id}`,
      modalCode: `<button onclick="window.open('https://checkout.com/one-page-shop/${shop.id}', 'One-Page-Shop', 'width=600,height=400')">Open Shop</button>`,
      iframeCode: `<iframe src="https://checkout.com/one-page-shop/${shop.id}" width="100%" height="600" frameborder="0"></iframe>`,
    },
  });
});

router.delete("/econest/:shopId", (req, res) => {
  const { shopId } = req.params;

  if (!shops.has(shopId)) {
    return res.status(404).json({ error: "Shop not found" });
  }

  shops.delete(shopId);

  res.json({
    success: true,
    message: "One-Page-Shop deleted successfully",
  });
});

module.exports = router;
