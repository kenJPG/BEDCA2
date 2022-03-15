//==================================
// Name: Kenneth Chen
// Class: DAAA/1B/04
// Admin Number: P2100072
//==================================

const express = require('express');

const path = require('path');

let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Endpoint to access js and css files
app.use('/', express.static(path.resolve(__dirname, '../public')))

// [Endpoint for Home page]
app.get('/', async(req, res) => {
	try {
		res.status(200).sendFile(
			path.resolve(__dirname, '../views/home.html')
		)
	} catch (err) {
		console.log(err);
		res.status(500).end("Something went wrong")
	}
})

// [Endpoint for Login page]
app.get('/login', async(req, res) => {
	try {
		
		res.status(200).sendFile(
			path.resolve(__dirname, '../views/login.html')
		)
	} catch (err) {
		console.log(err)
		res.status(500).end('Something went wrong')
	}
})

// [Endpoint for Register page]
app.get('/register', async(req, res) => {
	try {
		
		res.status(200).sendFile(
			path.resolve(__dirname, '../views/register.html')
		)

	} catch (err) {
		console.log(err)
		res.status(500).end('Something went wrong')
	}
})

// [Endpoint for products page]
app.get('/search', async(req, res) => {
	try {
		res.status(200).sendFile(
			path.resolve(__dirname, "../views/search.html")
		)
	} catch (err) {
		console.log(err);
		res.status(500).end("Something went wrong")
	}
})

// [Endpoint for viewing a product]
app.get('/product/:productid', async(req, res) => {
	try {
		res.status(200).sendFile(
			path.resolve(__dirname, "../views/product.html")
		)
		
	} catch (err) {
		console.log(err)
		res.status(500).end("Something went wrong")
	}
})
 
// [Endpoint for interests]
app.get('/interests', async(req, res) => {
	try {
		res.status(200).sendFile(
			path.resolve(__dirname, '../views/interests.html')
		)
	} catch (err) {
		console.log(err);
		res.status(500).end("Something went wrong")
	}
})


// [Endpoint for admin panel]
app.get('/admin', async(req, res) => {
	try {
		res.status(200).sendFile(
			path.resolve(__dirname, '../views/admin.html')
		)
	} catch (err) {
		console.log(err)
		res.status(500).end("Something went wrong")
	}
})

// [Endpoint for checkout page]
app.get('/checkout', async(req, res) => {
	try {
		res.status(200).sendFile(
			path.resolve(__dirname, '../views/checkout.html')
		)
	} catch (err) {
		console.log(err)
		res.status(500).end("Something went wrong")
	}
})


app.get('/home/partial/:type', async(req, res) => {
	try {
		switch (req.params.type || "") {
			case 'Public':
				res.status(200).sendFile(
					path.resolve(__dirname, '../views/partial/public/homeAccountPublic.html')
				)
				break

			case 'Customer':
				res.status(200).sendFile(
					path.resolve(__dirname, '../views/partial/customer/homeAccountCustomer.html')
				)
				break

			case 'Admin':
				res.status(200).sendFile(
					path.resolve(__dirname, '../views/partial/admin/homeAccountAdmin.html')
				)
				break

			default:
				res.status(404).end("Can't find what you're looking for")
		}
	} catch (err) {
		console.log(err)
		res.status(500).json({message: "Something went wrong"})
	}
})

app.get('/order/:orderid', async(req, res) => {
	try {
		res.status(200).sendFile(
			path.resolve(__dirname, '../views/orderpage.html')
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({message: "Something went wrong"})
	}
})

app.get('/orders', async(req, res) => {
	try {
		res.status(200).sendFile(
			path.resolve(__dirname, '../views/orderhistory.html')
		)
	} catch (err) {
		console.log(err)
		res.status(500).json({message: "Something went wrong"})
	}
})

app.all('*', (req, res) => {
	res.status(404).end("Error 404. Page Not Found")
})

module.exports = {app}