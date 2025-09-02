const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'db.json');
const saltRounds = 10;

const getDb = () => {
  const dbData = fs.readFileSync(dbPath);
  return JSON.parse(dbData);
};

const saveDb = (db) => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  const user = db.users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;
  const db = getDb();

  if (db.users.find(u => u.username === username)) {
    return res.status(400).send('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = {
    id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    username,
    password: hashedPassword,
    role: 'user' // Default role for new users
  };

  db.users.push(newUser);
  saveDb(db);

  res.status(201).send('User registered successfully');
};

module.exports = { login, register };