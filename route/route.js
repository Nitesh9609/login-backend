const express = require('express')
const router = express.Router()
const Controller = require('../controller/Controller')
const cors = require('cors')

router.get('/', Controller.setIndex)

router.post('/register',cors(), Controller.signUp)

router.post('/signin', cors(), Controller.signIn)



module.exports= router
