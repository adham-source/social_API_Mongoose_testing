// Call module mongoose to connect db
const mongoose = require('mongoose')

// Call module validator
const validator = require('validator')

// Call module to hash password
const bcryptJs = require('bcryptjs')

// Call module to generate token key
const jwt = require('jsonwebtoken')

// Used scheme to build structure collection
const userSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    userType: {
        type: Boolean,
        default: true
    },
    accountStatus: {
        type: Boolean, default: false
    },
    fName: {
        type: String, 
        maxlength: 20,
        minlength: 3,
        required: true,
        trim: true
    },
    lName: {
        type: String,
        maxlength: 20,
        minlength: 3,
        required: true,
        trim: true
    },
    userName: {type: String, trim: true, minlength: 3, maxlength: 50},
    userImage: {type: String},
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(val) {
            if(!validator.isEmail(val)) throw new Error (`This ${val} not valid email`)
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        // maxlength: 20, // Error ??? hash pass
        minlength: 8,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    friendes: [ // error when change fname to insert
        {
            friendId: {
                type: mongoose.Schema.Types.ObjectId,
                // unique: true
            }
        }
    ],
    tokens: [
        {
            generateToken: {
                type: String
            }
        }
    ]
}, {timestamps: true})

// To fake relation collections
userSchema.virtual('userPosts', {
    ref: 'posts',
    localField: '_id',
    foreignField: 'userId'
})

// To show logical data
userSchema.methods.toJSON = function () {
    let insertData = this.toObject()
    let notShow = ['password', 'createdAt', 'updatedAt']
    notShow.forEach(ele => delete insertData[ele])
    return insertData
}

// Added dynamic id , dynamic username and hash password
userSchema.pre('save', async function () {
    try {

        let insertData = this
        console.log(insertData.__v)
        if(insertData.__v == undefined) {
            console.log(`after if `)
            let lastUser = await users.findOne().sort({_id: -1})

            console.log(lastUser.id)
            !lastUser ? insertData.id = 1 : insertData.id = lastUser.id + 1
            

            if(!insertData.userName) insertData.userName = `${insertData.fName} ${insertData.lName}` //
        }
        
        if(insertData.isModified('password')) insertData.password = await bcryptJs.hash(insertData.password, 9)
            
    }
    catch(error) {
        error.message
    }
})

// To check email and password (login)
userSchema.statics.login = async(email, pass) => {
    let insertData = await UserInfo.findOne({email})
    if(!insertData) throw new Error (`Check Email or Password`)

    let matchPass = await bcryptJs.compare(pass, insertData.password)
    if(!matchPass) throw new Error (`Check Email or Password`)
    // insertData.accountStatus = true
    return insertData
}

// Generate token key and used authorization
userSchema.methods.generateAuthToken = async function () {
    let insertData = this
    let generateToken = jwt.sign({_id: insertData._id.toString()}, process.env.JWT)

    // Add token inserted tokens
    insertData.tokens = insertData.tokens.concat({generateToken})
    await insertData.save()
    return generateToken
}


// To used schema in file js
const UserInfo = mongoose.model('users', userSchema) // userInfo  in data bses userinfos ???

// To export any file
module.exports = UserInfo