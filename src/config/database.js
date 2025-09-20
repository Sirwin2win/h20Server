    // const mysql = require('mysql2/promise');
    const mysql = require('mysql');

    // const pool = mysql.createPool({
    //     host: 'localhost',
    //     user: 'root',
    //     password: '',
    //     database: 'buywaterh2o',
    //     waitForConnections: true,
    //     connectionLimit: 10,
    //     queueLimit: 0
    // });
    // module.exports = pool;

const connectDB = async () => {
    
    let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'buywaterh2o',
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

}

module.exports = connectDB