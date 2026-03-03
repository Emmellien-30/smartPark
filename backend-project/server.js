const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./db'); // Ensure your db.js uses mysql2/promise

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Session Management
app.use(session({
    secret: 'smartpark_rubavu_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// --- AUTHENTICATION ---

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    // Strong Encryption: 10 rounds of salting
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send("User registered");
    } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const match = await bcrypt.compare(password, rows[0].password);
        if (match) {
            req.session.user = rows[0].username;
            return res.send({ message: "Login successful" });
        }
    }
    res.status(401).send("Invalid credentials");
});

// --- STOCK OPERATIONS ---

// 1. Spare Parts (Initial Purchase Entry)
app.post('/api/spareparts', async (req, res) => {
    const { name, category, quantity, unit_price } = req.body;
    const total_price = quantity * unit_price;
    try {
        await db.execute('INSERT INTO spare_part (name, category, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)', 
            [name, category, quantity, unit_price, total_price]);
        res.send("Part added");
    } catch (err) { res.status(500).send(err.message); }
});

// Helper to get parts for dropdowns
app.get('/api/spareparts', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM spare_part');
    res.json(rows);
});

// 2. Stock In (Update existing stock)
app.post('/api/stockin', async (req, res) => {
    const { part_id, stockin_quantity, stockin_date } = req.body;
    try {
        // Increase quantity in main table
        await db.execute('UPDATE spare_part SET quantity = quantity + ? WHERE part_id = ?', [stockin_quantity, part_id]);
        // Record the transaction
        await db.execute('INSERT INTO stock_in (part_id, stockin_quantity, stockin_date) VALUES (?, ?, ?)', 
            [part_id, stockin_quantity, stockin_date]);
        res.send("Stock In recorded");
    } catch (err) { res.status(500).send(err.message); }
});

// 3. Stock Out (Full CRUD: Get, Post, Delete, Update)
app.get('/api/stockout', async (req, res) => {
    const [rows] = await db.execute(`
        SELECT so.*, p.name FROM stock_out so 
        JOIN spare_part p ON so.part_id = p.part_id
    `);
    res.json(rows);
});

app.post('/api/stockout', async (req, res) => {
    const { part_id, sout_quantity, sout_unitprice, stockout_date } = req.body;
    const qtyToRemoved = parseInt(sout_quantity);

    try {
        // 1. Fetch current quantity from the database
        const [rows] = await db.execute('SELECT quantity FROM spare_part WHERE part_id = ?', [part_id]);
        
        if (rows.length === 0) return res.status(404).send("Part not found");

        const availableQty = rows[0].quantity;

        // 2. CHECK: If we remove this, will it go below zero?
        if (availableQty < qtyToRemoved) {
            return res.status(400).send(`Error: Only ${availableQty} items left in stock. Cannot remove ${qtyToRemoved}.`);
        }

        // 3. Proceed only if stock is sufficient
        const total = qtyToRemoved * sout_unitprice;
        await db.execute('UPDATE spare_part SET quantity = quantity - ? WHERE part_id = ?', [qtyToRemoved, part_id]);
        await db.execute('INSERT INTO stock_out (part_id, sout_quantity, sout_unitprice, sout_totalprice, stockout_date) VALUES (?, ?, ?, ?, ?)', 
            [part_id, qtyToRemoved, sout_unitprice, total, stockout_date]);

        res.send("Stock out recorded successfully");
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});
/// update stockout id 
app.put('/api/stockout/:id', async (req, res) => {
    const { part_id, sout_quantity, sout_unitprice, stockout_date } = req.body;
    const newQty = parseInt(sout_quantity);
    const saleId = req.params.id;

    try {
        // 1. Fetch old record using correct column name: sout_quantity
        const [oldSaleRows] = await db.execute('SELECT * FROM stock_out WHERE sout_id = ?', [saleId]);
        if (oldSaleRows.length === 0) return res.status(404).send("Sale not found");
        
        const oldQty = oldSaleRows[0].sout_quantity; // FIXED: Changed from stockout_quantity
        const targetPartId = part_id || oldSaleRows[0].part_id;

        // 2. Check warehouse stock
        const [partRows] = await db.execute('SELECT quantity FROM spare_part WHERE part_id = ?', [targetPartId]);
        const currentInStock = partRows[0].quantity;

        if ((currentInStock + oldQty) < newQty) {
            return res.status(400).send(`Insufficient Stock! Max available is ${currentInStock + oldQty}`);
        }

        const adjustment = oldQty - newQty; 
        const totalAmount = newQty * sout_unitprice;
        
        // 3. Sync tables using correct schema names
        await db.execute('UPDATE spare_part SET quantity = quantity + ? WHERE part_id = ?', [adjustment, targetPartId]);
        
        // FIXED: Updated the SET list to match your DB image (sout_quantity, sout_totalprice, etc.)
        await db.execute(
            'UPDATE stock_out SET sout_quantity = ?, sout_unitprice = ?, sout_totalprice = ?, stockout_date = ? WHERE sout_id = ?', 
            [newQty, sout_unitprice, totalAmount, stockout_date, saleId]
        );

        res.send("Update successful");
    } catch (err) {
        res.status(500).send("Database Error: " + err.message);
    }
});

app.delete('/api/stockout/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM stock_out WHERE sout_id = ?', [req.params.id]);
        res.send("Record deleted");
    } catch (err) { res.status(500).send(err.message); }
});

// --- REPORTS ---

// General Daily Stock Status
app.get('/api/reports/daily-status', async (req, res) => {
    const query = `
        SELECT 
            p.name, 
            (p.quantity + IFNULL(SUM(so.sout_quantity), 0)) as stored_quantity,
            IFNULL(SUM(so.sout_quantity), 0) as stock_out,
            p.quantity as remaining_quantity
        FROM spare_part p
        LEFT JOIN stock_out so ON p.part_id = so.part_id
        GROUP BY p.part_id
    `;
    try {
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) { res.status(500).send(err.message); }
});

app.listen(5000, () => console.log("Server running on port 5000"));