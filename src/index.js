const express = require('express')
const router = require('../routes/rouet')
const { default: mongoose } = require('mongoose')
const bodyParser = require('body-parser')
const app = express()


// connect to databse
mongoose.connect("mongodb+srv://tshivendra07:6sWDbb2xoYJ5IZ0N@cluster0.3dhywqg.mongodb.net/blog-mini-project-1?retryWrites=true&w=majority",{
    useNewUrlParser : true
}).then(() =>{
    console.log('Database connected')
}).catch((error) =>{
    console.log(error.message)
})


// add call parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

// call router
app.use('/', router, (req, res) =>{
    try {
        return res.status(201).send('<h1>This is a mini blog project-1</h1>')
    } catch (error) {
        return res.status(500).send(error.message)
    }
})

// define Port
// const PORT = 1000

// call port
app.listen(process.env.PORT || 1000, () =>{
    console.log(`App is Running on http://localhost:${process.env.PORT || 1000}`)
})