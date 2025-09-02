const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

const getDb = () => {
  const dbData = fs.readFileSync(dbPath);
  return JSON.parse(dbData);
};

const saveDb = (db) => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

// Get all pending products
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.pendingProducts);
});

// Add a new pending product
router.post('/', (req, res) => {
  const db = getDb();
  const newProduct = {
    orderId: db.pendingProducts.length > 0 ? Math.max(...db.pendingProducts.map(p => p.orderId)) + 1 : 1,
    ...req.body
  };
  db.pendingProducts.push(newProduct);
  saveDb(db);
  res.status(201).json(newProduct);
});

// Update a pending product
router.put('/:id', (req, res) => {
  const db = getDb();
  const productIndex = db.pendingProducts.findIndex(p => p.orderId === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).send('Pending product not found');
  }

  const updatedProduct = { ...db.pendingProducts[productIndex], ...req.body };
  db.pendingProducts[productIndex] = updatedProduct;
  saveDb(db);
  res.json(updatedProduct);
});

// Delete a pending product
router.delete('/:id', (req, res) => {
  const db = getDb();
  const productIndex = db.pendingProducts.findIndex(p => p.orderId === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).send('Pending product not found');
  }

  db.pendingProducts.splice(productIndex, 1);
  saveDb(db);
  res.status(204).send();
});

module.exports = router;
