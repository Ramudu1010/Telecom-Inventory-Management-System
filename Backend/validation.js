
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegistration = [
  body('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  handleValidationErrors
];

const validateInventory = [
  body('name', 'Name is required').not().isEmpty(),
  body('type', 'Type is required').not().isEmpty(),
  body('status', 'Status is required').not().isEmpty(),
  body('quantity', 'Quantity must be a number').isNumeric(),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateInventory
};
