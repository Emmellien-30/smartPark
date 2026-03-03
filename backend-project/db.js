const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'Emmellien@123', // Your MySQL password
    database: 'SIMS',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();