require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 7000;
const SECRET_KEY = process.env.JWT_SECRET || "supersecret";

app.use(cors());
app.use(express.json());

const db = new sqlite3("employees.db");

// Create tables
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  salary REAL NOT NULL
)`).run();

// Seed employee data if table is empty
const count = db.prepare('SELECT COUNT(*) AS count FROM employees').get().count;
if(count === 0){
  db.prepare("INSERT INTO employees (name, role, salary) VALUES (?, ?, ?)")
    .run("Alice", "Manager", 60000);
  db.prepare("INSERT INTO employees (name, role, salary) VALUES (?, ?, ?)")
    .run("Bob", "Developer", 40000);
}

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// [API routes]

// 0. Health check
app.get("/", (req, res) => {
  res.json({ message: "Employee Management System API is running" });
});

// 1. Register admin
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashedPassword);
    res.json({ msg: "Admin registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

// 2. Login 
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "2h" });
    res.json({ token });
  });
});

// 3. Get all employees (no auth)
app.get("/employees", (req, res) => {
  const employees = db.prepare("SELECT * FROM employees").all();
  res.json(employees);
});

// 4. Add employee [Admin only]
app.post("/employees", authenticateToken, (req, res) => {
  const { name, role, salary } = req.body;
  if (!name || !role || !salary) 
    return res.status(400).json({ error: "All fields required" });

  try {
    db.prepare("INSERT INTO employees (name, role, salary) VALUES (?, ?, ?)")
      .run(name, role, salary);
    res.json({ msg: "Employee created" });
  } catch (err) {
    res.status(400).json({ error: "Insert failed: " + err });
  }
});

// 5. Update employee [Admin only]
app.put("/employees/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, role, salary } = req.body;
  db.prepare("UPDATE employees SET name=?, role=?, salary=? WHERE id=?")
    .run(name, role, salary, id);
  res.json({ msg: "Employee updated" });
});

// 6. Delete employee [Admin only]
app.delete("/employees/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM employees WHERE id=?").run(id);
  res.json({ msg: "Employee deleted" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
