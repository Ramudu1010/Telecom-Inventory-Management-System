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

// Get all products
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.products);
});

// Add a new product
router.post('/', (req, res) => {
  const db = getDb();
  const newProduct = {
    id: db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
    ...req.body
  };
  db.products.push(newProduct);
  saveDb(db);
  res.status(201).json(newProduct);
});

// Update a product
router.put('/:id', (req, res) => {
  const db = getDb();
  const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }

  const updatedProduct = { ...db.products[productIndex], ...req.body };
  db.products[productIndex] = updatedProduct;
  saveDb(db);
  res.json(updatedProduct);
});

// Delete a product
router.delete('/:id', (req, res) => {
  const db = getDb();
  const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).send('Product not found');
  }

  db.products.splice(productIndex, 1);
  saveDb(db);
  res.status(204).send();
});

module.exports = router;
