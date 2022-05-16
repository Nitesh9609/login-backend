const express = require('express')
const router = express.Router()
const Controller = require('../controller/Controller')
const cors = require('cors')
const verify = require('./authVerify')

router.get('/', Controller.setIndex)

router.post('/register', Controller.signUp)

router.post('/signin', cors(), Controller.signIn)

router.get('/getall',verify,cors(), Controller.getAll)

router.get('/getUserDetail/:id',cors(), Controller.getPerticularUser)

module.exports= router
