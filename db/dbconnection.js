// Call module mongoose to connect db
const mongoose = require('mongoose')
// .then( // Success
try {
    mongoose.connect(process.env.dbURL, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
}
catch(error) {
    console.log(error.message)
}
// )
// .catch(error => console.log(error)) // Error