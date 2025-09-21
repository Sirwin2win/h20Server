    // const mysql = require('mysql2/promise');
    const mysql = require('mysql');

    const pool = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'buywaterh2o',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    pool.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});
    module.exports = pool;

// const connectDB = async () => {
    
//     let con = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: "",
//   database: process.env.DB_DATABASE,
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// }

// module.exports = connectDB