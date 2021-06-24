// Call module express
const express = require('express')

// To used connection db
require('../db/dbconnection')

// Call file routes
const usersRoute = require('../routes/users.route')

// Store module express and run
appEx = express()

// To convert data to inserted db 
appEx.use(express.json())

// To use run users route
appEx.use(usersRoute)

// To export module express any page
module.exports = appEx
