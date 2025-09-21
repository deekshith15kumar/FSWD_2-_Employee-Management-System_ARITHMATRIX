# Employee Management System

This project is a simple Employee Management System with secure user authentication using JWT tokens, built using Node.js, Express, and SQLite for the backend, and vanilla HTML/JavaScript for the frontend.

---

## Features
- User registration and login with password hashing.
- Secure authentication using JWT tokens.
- CRUD operations for employee management:
  - Create, Read, Update, Delete employees.
- Responsive frontend UI for user interactions.
- Backend APIs protected by authentication middleware.
- Data persistence using SQLite.

---

## Project Structure

/ (root folder)
│
├── server.js # Backend Express server code
├── employees.db # SQLite database file
├── login.html # Frontend login page
├── frontend.html # Frontend employee management page
├── package.json # NPM dependencies and scripts
└── README.md # This documentation file

---

## Prerequisites
- Node.js and npm must be installed.
- Basic knowledge of command line usage.

---

## Installation & Setup

1. Clone or download this repository.

2. Install dependencies by running:
npm install


3. Start the backend server:
npm start



4. Serve the frontend files using a local static server:
npx http-server


The frontend server will usually run at [http://localhost:8080](http://localhost:8080)

5. Access the app frontend:
- Login page: [http://localhost:8080/login.html](http://localhost:8080/login.html)
- After successful login, you will be redirected to employee management page.

---

## API Endpoints

| Route              | Method | Authentication | Description                      | Payload Example                   |
|--------------------|---------|----------------|--------------------------------|---------------------------------|
| `/register`        | POST    | None           | Register a new admin user       | `{ "username": "admin", "password": "admin123" }` |
| `/login`           | POST    | None           | User login, returns JWT token   | `{ "username": "admin", "password": "admin123" }`  |
| `/employees`       | GET     | None           | Get all employee records        | None                            |
| `/employees`       | POST    | Bearer JWT     | Add a new employee              | `{ "name": "John", "role": "Dev", "salary": 50000 }` |
| `/employees/:id`   | PUT     | Bearer JWT     | Update employee details         | `{ "name": "John", "role": "Senior Dev", "salary": 60000 }`|
| `/employees/:id`   | DELETE  | Bearer JWT     | Delete an employee              | None                            |

---

## How to Register and Test

- Register your first admin by sending a POST request to `/register` (use CURL or Postman):
curl -X POST http://localhost:7000/register -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'

- Login via frontend or Postman.
- Use the JWT token returned in login responses for protected routes.

---

## Usage

- Open [login page](http://localhost:8080/login.html) and enter your credentials.
- Upon successful login, you are redirected to the employee management UI.
- Use Add/Edit/Delete buttons to manage employees.
- All changes are persisted in the SQLite database.

---

## Troubleshooting

- **“Failed to fetch” error**:  
Ensure backend and frontend servers are running on correct ports.  
Confirm `login.html` and `frontend.html` fetch URLs match your backend port.  
Always serve frontend via HTTP server (do not open HTML files directly).

- **CORS errors**:  
Backend has CORS enabled; check it remains so before API routes.

- **Other errors**:  
Check terminal logs for backend and browser console logs for frontend.

---

## License

This project is licensed under the MIT License.

---

## Author

K DEEKSHITH KUMAR   
kattadeekshith15@gmail.com  
[text](https://www.linkedin.com/in/deekshith-kumar-17302b21a/)

---
