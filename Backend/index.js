require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { login, register } = require('./auth');
const { validateRegistration } = require('./middleware/validation');
const verifyToken = require('./authMiddleware');
const inventoryRoutes = require('./api/inventory');
const suppliersRoutes = require('./api/suppliers');
const productsRoutes = require('./api/products');
const orderedProductsRoutes = require('./api/ordered-products');
const pendingProductsRoutes = require('./api/pending-products');
const dashboardRoutes = require('./api/dashboard');

const app = express();
const port = 3001;

const submittedIssues = []; // Global array to store submitted issues

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.post('/login', login);

app.post('/register', validateRegistration, register);

app.use('/api/inventory', verifyToken, inventoryRoutes);
app.use('/api/suppliers', verifyToken, suppliersRoutes);
app.use('/api/products', verifyToken, productsRoutes);
app.use('/api/ordered-products', verifyToken, orderedProductsRoutes);
app.use('/api/pending-products', verifyToken, pendingProductsRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);

app.post('/api/contact', verifyToken, (req, res) => {
  const { subject, message } = req.body;
  const newIssue = { subject, message, timestamp: new Date() };
  submittedIssues.push(newIssue);
  console.log(`New contact form submission:\nSubject: ${subject}\nMessage: ${message}`);
  res.status(200).send('Message received successfully!');
});

app.get('/api/issues', verifyToken, (req, res) => {
  res.status(200).json(submittedIssues);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});