const express = require('express');
const router = express.Router();
const crypto = require('crypto');


const shops = new Map();


router.post('/econest/create-paylink/create', (req, res) => {
  const { shopName, brandColors, items, paymentMethods } = req.body;

  if (!shopName || !items || items.length === 0) {
    return res.status(400).json({ error: 'Shop name and at least one item are required' });
  }

  const shopId = crypto.randomBytes(8).toString('hex');
  const shop = {
    id: shopId,
    name: shopName,
    brandColors: brandColors || { primary: '#000000', secondary: '#ffffff' },
    items: items,
    paymentMethods: paymentMethods || ['visa', 'mastercard', 'paypal'],
    createdAt: new Date().toISOString()
  };

  shops.set(shopId, shop);

  res.status(201).json({
    success: true,
    message: 'One-Page-Shop created successfully',
    shop: {
      id: shop.id,
      name: shop.name,
      url: `https://checkout.com/one-page-shop/${shop.id}`,
      modalCode: `<button onclick="window.open('https://checkout.com/one-page-shop/${shop.id}', 'One-Page-Shop', 'width=600,height=400')">Open Shop</button>`,
      iframeCode: `<iframe src="https://checkout.com/one-page-shop/${shop.id}" width="100%" height="600" frameborder="0"></iframe>`
    }
  });
});



module.exports = router;