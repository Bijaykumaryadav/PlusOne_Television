const express = require('express');
const router = express.Router();
const axios = require('axios');
// const esewaConfig = require('../config/esewa');
const khaltiConfig = require('../config/khalti');

// previously there was an eSewa helper here; removed in favor of Khalti below

// Khalti integration: client requests a payment token
router.post('/khalti/create', async (req, res) => {
  const { amount, pid } = req.body;
  if (!amount || !pid) {
    return res.status(400).json({ error: 'amount and pid required' });
  }
  try {
    // Khalti expects amount in paisa (1 NPR = 100 paisa)
    const r = await axios.post(
      'https://khalti.com/api/v2/payment/request/',
      {
        amount: Math.round(amount * 100),
        product_identity: pid,
        product_name: 'Sidha Reporting Order',
        product_url: khaltiConfig.PRODUCT_URL || 'https://example.com',
      },
      {
        headers: {
          Authorization: `Key ${khaltiConfig.SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.json(r.data);
  } catch (err) {
    console.error('Khalti request error', err.message);
    return res.status(500).json({ error: 'khalti request failed' });
  }
});

// simple GET endpoints so the gateway can come back to us
// old eSewa routes removed – we now rely on Khalti widget/token approach
// (If you still need eSewa later, uncomment and adapt above.)

module.exports = router;
