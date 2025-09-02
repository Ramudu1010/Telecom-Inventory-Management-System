
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { validateInventory } = require('../middleware/validation');

const dbPath = path.join(__dirname, '../db.json');

const getDb = () => {
  const dbData = fs.readFileSync(dbPath);
  return JSON.parse(dbData);
};

const saveDb = (db) => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

// Get all inventory items
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.inventory);
});

// Add a new inventory item
router.post('/', validateInventory, (req, res) => {
  const db = getDb();
  const newItem = {
    id: db.inventory.length > 0 ? Math.max(...db.inventory.map(i => i.id)) + 1 : 1,
    ...req.body
  };
  db.inventory.push(newItem);
  saveDb(db);
  res.status(201).json(newItem);
});

// Update an inventory item
router.put('/:id', validateInventory, (req, res) => {
  const db = getDb();
  const itemIndex = db.inventory.findIndex(i => i.id === parseInt(req.params.id));

  if (itemIndex === -1) {
    return res.status(404).send('Item not found');
  }

  const updatedItem = { ...db.inventory[itemIndex], ...req.body };
  db.inventory[itemIndex] = updatedItem;
  saveDb(db);
  res.json(updatedItem);
});

// Delete an inventory item
router.delete('/:id', (req, res) => {
  const db = getDb();
  const itemIndex = db.inventory.findIndex(i => i.id === parseInt(req.params.id));

  if (itemIndex === -1) {
    return res.status(404).send('Item not found');
  }

  db.inventory.splice(itemIndex, 1);
  saveDb(db);
  res.status(204).send();
});

// Get low stock items
router.get('/low-stock', (req, res) => {
  const db = getDb();
  const lowStockItems = db.inventory.filter(item => item.quantity < 5);
  res.json(lowStockItems);
});

// Get full stock items
router.get('/full-stock', (req, res) => {
  const db = getDb();
  const fullStockItems = db.inventory.filter(item => item.quantity > 50);
  res.json(fullStockItems);
});

module.exports = router;
