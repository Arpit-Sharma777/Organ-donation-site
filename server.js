/* Organ Donation Website - Full-Stack Application */

// Import dependencies
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'sql5.freesqldatabase.com',
    user: 'sql5767352',
    password: 'gPfJkGhnSK',
    database: 'sql5767352'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    let { username, password } = req.body;
    let sql = "SELECT * FROM login WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.loggedin = true;
            res.redirect('/dashboard');
        } else {
            res.send('Incorrect login credentials');
        }
    });
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/login');
    }
});

// Donor Registration
app.post('/register-donor', (req, res) => {
    let { donor_id, organ_donated, reason, organization_id, user_id } = req.body;
    let sql = "INSERT INTO Donor VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [donor_id, organ_donated, reason, organization_id, user_id], (err, result) => {
        if (err) throw err;
        res.send('Donor registered successfully');
    });
});

// Patient Registration
app.post('/register-patient', (req, res) => {
    let { patient_id, organ_req, reason, doctor_id, user_id } = req.body;
    let sql = "INSERT INTO Patient VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [patient_id, organ_req, reason, doctor_id, user_id], (err, result) => {
        if (err) throw err;
        res.send('Patient registered successfully');
    });
});

// Get Organ Availability
app.get('/organs', (req, res) => {
    let sql = "SELECT * FROM Organ_available";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get Doctor & Organization Details
app.get('/doctors', (req, res) => {
    let sql = "SELECT * FROM Doctor";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/organizations', (req, res) => {
    let sql = "SELECT * FROM Organization";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get Transactions
app.get('/transactions', (req, res) => {
    let sql = "SELECT * FROM Transactions";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Fetch Donors
app.get('/donors', (req, res) => {
    let sql = "SELECT * FROM Donor";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Fetch Patients
app.get('/patients', (req, res) => {
    let sql = "SELECT * FROM Patient";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Fetch Transactions
app.get('/transactions', (req, res) => {
    let sql = "SELECT * FROM Transactions";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
