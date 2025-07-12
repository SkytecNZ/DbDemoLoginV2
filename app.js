// 
// To demo Login and Register
// Author: Ganeshan and Tariq
// Date created: 28 June 2025
// Version: 1.1

var express = require('express');
var session = require('express-session');
var conn = require('./dbConfig');
var app=express();

//ejs template
app.set('view engine','ejs');

app.use(session({
	secret: 'yoursecret',
	resave: true,
	saveUninitialized: true
}));

app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res){
	res.render("home");
});
	
app.get('/page2', function (req, res){
	res.render("page2");
});

app.get('/loginRegister', function (req, res){
	res.render("loginRegister");
});

app.get('/login', function(req, res) {
	res.render('login.ejs');
});

app.post('/auth', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		conn.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/membersOnly');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.get('/register', function (req, res){
	res.render("register");
});

//REGISTER USER
app.post('/register', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		var sql = `INSERT INTO users (username, password) VALUES ("${username}", "${password}")`;
		conn.query(sql, function(err, result) {
			if (err) throw err;
			console.log('New Record inserted');
			res.render('loginRegister');
		})
	}
	else {
		console.log("Error");
	}
  });

  // Retrieve all users
app.get('/users', function(req, res) {
    if (req.session.loggedin) {
        conn.query('SELECT * FROM users', function(err, results) {
            if (err) throw err;
            res.render('membersOnly', { users: results });
        });
    } else {
        res.send('Please login to view this page!>');
    }
});


// Delete a user
app.post('/deleteUser', function(req, res) {
    const userId = req.body.id;
    conn.query('DELETE FROM users WHERE id = ?', [userId], function(err, result) {
        if (err) throw err;
				console.log('user Record deleted');
        res.redirect('/user-management');
    });
});


// Update a user
app.post('/updateUser', function(req, res) {
    const userId = req.body.id;
    const newUsername = req.body.username;
    const newPassword = req.body.password;
    conn.query('UPDATE users SET username = ?, password = ? WHERE id = ?', [newUsername, newPassword, userId], function(err, result) {
        if (err) throw err;
        res.redirect('/user-management');
    });
});
app.get('/user-management', function (req, res) {
    if (req.session.loggedin) {
        conn.query('SELECT * FROM users', function(err, results) {
            if (err) throw err;
            res.render('userManagement', { users: results });
        });
    } else {
        res.send('Please login to view this page!');
    }
});

//Add USER
app.post('/addUser', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		var sql = `INSERT INTO users (username, password) VALUES ("${username}", "${password}")`;
		conn.query(sql, function(err, result) {
			if (err) throw err;
			console.log('record inserted');
			res.redirect('/user-management');			
		})
	}
	else {
		console.log("Error");
	}
  });

// Users can access this if they are logged in
app.get('/membersOnly', function (req, res, next) {
	if (req.session.loggedin) {
		res.render('membersOnly');
	} 
	else {
		res.send('Please login to view this page!');
	}
});

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/products', function (req, res) {
    if (req.session.loggedin) {
        conn.query('SELECT * FROM products', function(err, results) {
            if (err) throw err;
            res.render('productManagement', { users: results });
        });
    } else {
        res.send('Please login to view this page!');
    }
});

// Middleware to check if user is logged in
// Product Management Route
// Users can access this if they are logged in
app.get('/product-management', function (req, res) {
    if (req.session.loggedin) {
        conn.query('SELECT * FROM products', function(err, results) {
            if (err) throw err;
            res.render('productManagement', { products: results });
        });
    } else {
        res.send('Please login to view this page!');
    }
});
// Add a new product
app.post('/addProduct', function(req, res) {	
	let name = req.body.name;
	let price = req.body.price;
	let description = req.body.description;	

if (name && price && description) {
		var sql = `INSERT INTO products (name, price, description) VALUES ("${name}", "${price}", "${description}")`;
		conn.query(sql, function(err, result) {
		
			if (err) throw err;
			console.log('product added');
			res.redirect('/product-management');			
		})
	}
	else {
		console.log("Error");
	}
  });
// Delete a Product
app.post('/deleteProduct', function(req, res) {
    const productsId = req.body.id;
    conn.query('DELETE FROM products WHERE id = ?', [productsId], function(err, result) {
        if (err) throw err;
				console.log('Product Record deleted');
        res.redirect('/product-management');
    });
});
// Update a Product
app.post('/updateProduct', function(req, res) {
    const productsId = req.body.id;
    const newProductsname = req.body.name;
    const newDescription = req.body.description;
		const newPrice = req.body.price;
		conn.query('UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?', [newProductsname, newPrice, newDescription, productsId], function(err, result) {
				if (err) throw err;
				console.log('Product Record updated');
				res.redirect('/product-management');
		});
    
});

app.listen(3001);
console.log('Node app is running on port 3001');
