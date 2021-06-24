// Call express module
const express = require('express')

// To used express whis router
const router = new express.Router()

// Call user model file to used
const usersModel = require('../models/users.model')

// Call middleware auth
const auth = require('../middleware/auth.middleware') 
const multer = require('multer')

// Register to add user into data base
router.post('/user/resigter', async (req, res) => {
    try {
        let insertData = new usersModel(req.body)
        await insertData.save()
        res.status(200).send({
            apiStatus: true,
            dataInserted: {insertData},
            message: `Data inserted`
        })
    }
    catch(error) {
        res.status(404).send({
            apiStatus: false,
            dataInserted: error,
            message: `Check data to insert`
        })
    }
})

router.post('/user/login', async (req, res) => {
    try {
        let insertData = await usersModel.login(req.body.email, req.body.password)
        let generateToken = await insertData.generateAuthToken()
        res.status(200).send({
            apiStatus: true,
            dataInserted: {insertData, generateToken},
            message: `Logged in`
        })
    }
    catch(error) {
        res.status(404).send({
            apiStatus: false,
            dataInserted: error.message, // to show message by fubction login error.message
            message: `Check info data to login`
        })
    }
})

// Routes to edit any users
router.patch('/user/edit', auth.authGeneralToken, async (req, res) => {
    let infoUpdate = Object.keys(req.body)
    let keyAllowed = ['fName','lName', 'password']
    let checkUpdate = infoUpdate.every(val => keyAllowed.includes(val))
    // res.send(req.insertData)
    // infoUpdate.forEach(val => res.send(req.body[val]))
    

    try {
        
        if(!checkUpdate)  throw new Error (`Not allowed ! please choose ${keyAllowed} only`)
        
        infoUpdate.forEach(ele => req.insertData[ele] = req.body[ele])
        
        await req.insertData.save()
        
        res.status(200).send({
            apiStatus: true,
            dataInserted: {infoUpdate}, // isertetData undefined
            message: `done! data updated`
        })
    }

    catch(error) {
        res.status(500).send({
            apiStatus: false,
            dataInserted: error,
            message: `Can't updated`
        })
    }
})

router.get('/myAccount', auth.authGeneralToken, (req, res) => {
    // req.insertData = insertData
    //     req.generateToken = generateToken
    // console.log(`insertData ${req.insertData} ==> generateToken ${req.generateToken}`)
    
    res.send({insertData: req.insertData, generateToken: req.generateToken})
})

// Add friend ?????? !!!!!!!!!!!!!!!!!!!!!
router.post('/user/addFriends', auth.authGeneralToken, async(req, res) => {
    let fID = req.body
    res.send(fID)
})

router.get('/user/displayAll', async (req, res) => {
    try {
        let insertData = await usersModel.find()
        res.status(200).send({
            apiStatus: true,
            dataInserted: insertData,
            message: `All users data`
        })
    }
    catch(error) {
        res.status(404).send({
            apiStatus: false,
            dataInserted: error,
            message: `Not found data`
        })
    }
})

// Logout from one device
router.post('/logout', auth.authGeneralToken, async(req, res) => {
    
    try {
        // req.insertData.tokens.filter(ele => ele.generateToken != req.generateToken) // don`t remove from db
        let delToken = req.insertData.tokens.findIndex(ele => ele.generateToken == req.generateToken)
        if(delToken !== -1) `Token not founded`
        req.insertData.tokens.splice(delToken, 1)
        await req.insertData.save()
        res.status(200).send({
            apiStatus: true,
            message: `Logged out`
        })
    }
    catch(error) {
        res.status(500).send({
            apiStatus: false,
            message: `Error to log out`
        })
    }
    
})

// Logout from all devices
router.post('/logoutAll', auth.authGeneralToken, async(req, res) => {
    
    try {
        req.insertData.tokens = []
        await req.insertData.save()
        res.status(200).send({
            apiStatus: true,
            message: `Logged out from all devices`
        })
    }
    catch(error) {
        res.status(500).send({
            apiStatus: false,
            message: `Error to log out`
        })
    }
    
})


// router.delete('/user/del', auth.authToken, async (req, res) => {
//     try {
//         await res.send(req.insertData)
//     }
//     catch(error) {
//         res.send(error)
//     }
// })


// imageName = ''
// let storage = multer.diskStorage({
//     destination: (req, res, call) => call(null, 'images'),
//     filename: (req, file, call) => {
//         imageName = Date.now() + '.' + (file.originalname.split('.').pop())
//         call(null, imageName)
//     }

// })

// let upload = multer({storage: storage})
// router.post('/uploadFile', upload.single('profile'), async(req, res) => {
//     res.send(`Uploaded file`)
// })

// To exprot file user route
module.exports = router
