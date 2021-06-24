const appEx = require('./src/app')

appEx.post('/test', (req, res) => {
    
    res.send(`Testing`)
})


appEx.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`))