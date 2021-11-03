const express = require('express')
const app = express()
const port = 3000

// Configure sqlite
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./dictons.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the dictons database.');
});

// Decode url encoded form parameters (POST requests)
app.use(express.urlencoded())

// Decode json encoded parameters (POST requests)
app.use(express.json())

// GET /
// Displays a random dicton in HTML.
// Example: <q>random dicton</q>
app.get('/', (req, res) => {
    db.get("SELECT dicton FROM dictons ORDER BY random() LIMIT 1", [], function(err, row) {
        res.send(`<q>${row.dicton}</q>`);
    });
});

// GET /list
// Displays all the dictons ordered by id in HTML
// Example: <ul><li><a href="/1">dicton 1</a></li></ul> 
app.get('/list', (req, res) => {
    db.all("SELECT id, dicton FROM dictons ORDER BY id", [], function(err, rows) {
        let list = rows.map(row => `<li><a href="/${row.id}">${row.dicton}</a>`).join('')
        res.send(`<ul>${list}</ul>`);
    });
});

// GET /create
// Displays a HTML form for creating new dictons with POST requests.
// Example: <form method=POST><input type='text' name='dicton'></input><button>Nouveau dicton</button></form>
app.get('/create', (req, res) => {
    res.send("<form method=POST><input type='text' name='dicton'></input><button>Nouveau dicton</button></form>")
});

// POST /create
// Inserts a new dicton in the database and redirect the user to its url
// Example: 301 /list
app.post('/create', (req, res) => {
    db.run("INSERT INTO dictons (dicton) VALUES (?)", req.body.dicton, function(err, row) {
        res.redirect('/list');
    });
});

// GET /:id
// Returns a dicton by its id.
app.get('/:id', (req, res) => {
    db.get("SELECT dicton FROM dictons WHERE id = ?", [req.params.id], function(err, row) {
        res.send(row.dicton);
    });
});

// Start the server
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Export the server
module.exports = server;