const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const apiRoute = require('./route/route')

port=8080;

app.use(express.json(),cors())

app.use('/app/user', apiRoute)

dotenv.config()


mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true})
.then(()=>{
    console.log('connected to DB')
}).catch(err => console.log(err))

app.listen(port,() =>{
    console.log(`backend is running on http://localhost:${port}`)
} )