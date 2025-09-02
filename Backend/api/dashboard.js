const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

const getDb = () => {
  const dbData = fs.readFileSync(dbPath);
  return JSON.parse(dbData);
};

router.get('/stats', (req, res) => {
  const db = getDb();
  const totalOrders = db.orderedProducts.length;
  const totalStock = db.inventory.reduce((acc, item) => acc + item.quantity, 0);
  const totalRevenue = totalOrders * 50; // Assuming a fixed price of $50 per order
  const lowStock = db.inventory.filter(item => item.quantity < 5).length;
  const fullStock = db.inventory.filter(item => item.quantity > 50).length;

  res.json({
    totalOrders,
    totalStock,
    totalRevenue,
    lowStock,
    fullStock,
  });
});

module.exports = router;