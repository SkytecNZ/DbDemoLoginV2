// DB is with 2 tables - product & users
var mysql = require('mysql');
var conn = mysql.createConnection({
	host: 'localhost', 
	user: 'root',      
	password: '',    
	database: 'fsa_db'
}); 

conn.connect(function(err) {
	if (err) throw err;
	console.log('Database connected');
});

module.exports = conn;