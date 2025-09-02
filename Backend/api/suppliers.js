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

// Get all suppliers
router.get('/', (req, res) => {
  const db = getDb();
  res.json(db.suppliers);
});

// Add a new supplier
router.post('/', (req, res) => {
  const db = getDb();
  const newSupplier = {
    id: db.suppliers.length > 0 ? Math.max(...db.suppliers.map(s => s.id)) + 1 : 1,
    ...req.body
  };
  db.suppliers.push(newSupplier);
  saveDb(db);
  res.status(201).json(newSupplier);
});

// Update a supplier
router.put('/:id', (req, res) => {
  const db = getDb();
  const supplierIndex = db.suppliers.findIndex(s => s.id === parseInt(req.params.id));

  if (supplierIndex === -1) {
    return res.status(404).send('Supplier not found');
  }

  const updatedSupplier = { ...db.suppliers[supplierIndex], ...req.body };
  db.suppliers[supplierIndex] = updatedSupplier;
  saveDb(db);
  res.json(updatedSupplier);
});

// Delete a supplier
router.delete('/:id', (req, res) => {
  const db = getDb();
  const supplierIndex = db.suppliers.findIndex(s => s.id === parseInt(req.params.id));

  if (supplierIndex === -1) {
    return res.status(404).send('Supplier not found');
  }

  db.suppliers.splice(supplierIndex, 1);
  saveDb(db);
  res.status(204).send();
});

module.exports = router;
