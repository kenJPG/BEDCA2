/*
=======================
This file is responsible for starting the FRONTEND server

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/
require('dotenv').config()

const {app} = require('./controller/index.js');

app.listen(process.env.PORT, () => {
	console.log(`Frontend Server running and listening on port ${process.env.PORT}`)
})