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

// Get all ordered products
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.orderedProducts);
});

// Add a new ordered product
router.post('/', (req, res) => {
  const db = getDb();
  const newProduct = {
    orderId: db.orderedProducts.length > 0 ? Math.max(...db.orderedProducts.map(p => p.orderId)) + 1 : 1,
    ...req.body
  };
  db.orderedProducts.push(newProduct);
  saveDb(db);
  res.status(201).json(newProduct);
});

// Update an ordered product
router.put('/:id', (req, res) => {
  const db = getDb();
  const productIndex = db.orderedProducts.findIndex(p => p.orderId === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).send('Ordered product not found');
  }

  const updatedProduct = { ...db.orderedProducts[productIndex], ...req.body };
  db.orderedProducts[productIndex] = updatedProduct;
  saveDb(db);
  res.json(updatedProduct);
});

// Delete an ordered product
router.delete('/:id', (req, res) => {
  const db = getDb();
  const productIndex = db.orderedProducts.findIndex(p => p.orderId === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).send('Ordered product not found');
  }

  db.orderedProducts.splice(productIndex, 1);
  saveDb(db);
  res.status(204).send();
});

module.exports = router;
