const mysql = require('mysql');
let connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else {
    connection = mysql.createConnection({
        host: '85.10.205.173',
        port: 3306,
        user: 'userdatabase',
        password: '12345678',
        database: 'mydatabaseweb'
    });
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
}

module.exports = connection;

