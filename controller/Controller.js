const userData = require('../model/User-model')
const bcrypt = require('bcryptjs')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')

exports.setIndex = (req,res) =>{
    res.send('backend is running')
}


exports.signUp = async (req,res) =>{
    const emailExist = await userData.findOne({email:req.body.email})

    if(emailExist){
        res.send('email already exists')
        return;
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)
    const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword,salt)

    try {
        
        const registrationSchema = Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().min(6).required().email(),
            address: Joi.string().min(6).required(),
            password: Joi.string().min(8).required(),
            confirmPassword: Joi.string().min(8).required()

        })

        const {error} = await registrationSchema.validateAsync(req.body)

        if(error){
            res.send(error.details[0].message)
        }else{
            if(hashedPassword === hashedConfirmPassword){
                const user = new userData({
                    name: req.body.name,
                    email: req.body.email,
                    address: req.body.address,
                    password: hashedPassword,
                    confirmPassword: hashedConfirmPassword
                })

                const saveUser = await user.save()
                res.send('user created successfully')
            }
            else{
                res.send('Password doesnot match ')
            }
        }


    } catch (error) {
        res.status(500).send(error)
    }


}


exports.signIn = async (req,res) =>{
    const user = await userData.findOne({email:req.body.email})

    if(!user) return res.status(400).send('Please SignUp First')
    

    const validatePassword = await bcrypt.compare(req.body.password, user.password)
    if(!validatePassword) return res.status(400).send('incorrect password')
    
    
    try {
        const loginSchema = Joi.object({
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(8).required()
        })

        const {error} = await loginSchema.validateAsync(req.body)

        if(error) return res.status(400).send(error.details[0].message)
        else{
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
            
            res.header("auth-token", token).send(token)
            // res.send("Logged in successfully")
        }
    } catch (error) {
        res.status(500).send(error)
    }
}