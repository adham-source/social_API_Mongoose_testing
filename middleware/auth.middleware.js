// Call module jwt to generate token
const jwt = require('jsonwebtoken')

// Call user model file to used
const usersModel = require('../models/users.model')

// Create function to make generate authToken
const authTokenAdmin = async (req, res, next) => {
    try {
        let generateToken = req.header('Authorization').replace('bearer ', '')
        // console.log(generateToken)
        let decodeToken = jwt.verify(generateToken, process.env.JWT)
        // console.log(decodeToken)
        let insertData = await usersModel.findOne({
            _id: decodeToken._id,
            'tokens.generateToken': generateToken,
            userType: false
        })
        // console.log(insertData)
        if(!insertData) throw new Error (`Check authAdmin `)
        req.insertData = insertData
        req.generateToken = generateToken
        next()
    }
    catch(error) {
        res.status(500).send({
            apiStatus: false,
            dataInserted: error.message,
            message: `unauthorized`
        })
    }
}

// Create function to make generate authToken
const authToken = async (req, res, next) => {
    try {
        let generateToken = req.header('Authorization').replace('bearer ', '')
        // console.log(generateToken)
        let decodeToken = jwt.verify(generateToken, process.env.JWT)
        // console.log(decodeToken)
        let insertData = await usersModel.findOne({
            _id: decodeToken._id,
            'tokens.generateToken': generateToken,
            userType: true
        })
        // console.log(insertData)
        if(!insertData) throw new Error (`Check user type`)
        req.insertData = insertData
        req.generateToken = generateToken
        next()
    }
    catch(error) {
        res.status(500).send({
            apiStatus: false,
            dataInserted: error.message,
            message: `unauthorized`
        })
    }
}

// Create function to make generate authGeneralToken
const authGeneralToken = async (req, res, next) => {
    try {
        let generateToken = req.header('Authorization').replace('bearer ', '')
        // console.log(generateToken)
        let decodeToken = jwt.verify(generateToken, process.env.JWT)
        // console.log(decodeToken)
        let insertData = await usersModel.findOne({
            _id: decodeToken._id,
            'tokens.generateToken': generateToken
        })
        // console.log(insertData)
        if(!insertData) throw new Error (`Check auth`)
        req.insertData = insertData
        req.generateToken = generateToken
        next()
    }
    catch(error) {
        res.status(500).send({
            apiStatus: false,
            dataInserted: error.message,
            message: `unauthorized`
        })
    }
}

// To used any file
module.exports = {
    authTokenAdmin,
    authToken,
    authGeneralToken
}