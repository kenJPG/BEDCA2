/*
=======================
This file is responsible for starting the BACKEND server

Class: DAAA/FT/1B/04
Name: Kenneth Chen
Student ID: P2100072
=======================
*/
require('dotenv').config() // Using environment variables to store config

const {router} = require('./controller/app.js');

router.listen(process.env.PORT, () => {
	console.log(`Backend Server running and listening on port ${process.env.PORT}`)
})