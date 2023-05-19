const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc Register user
// @route POST api/users
// @access Public
const registerUser= asyncHandler(async (req, res) => {
    const { name, email, password }= req.body

    //chekc if all fields are entered 
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields.')
    }

    //check if user already exists
    const userExists= await User.findOne({ email })
    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    //Hash password
    const salt= await bcrypt.genSalt(10)
    const hashedPassword= await bcrypt.hash(password, salt)

    //Create user
    const user= await User.create({
        name,
        email,
        password: hashedPassword
    })

    //If user is created, send the details to client as below
    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data.')
    }
})

// @desc Authenticate a user (login)
// @route POST api/users/login
// @access Public
const loginUser= asyncHandler(async (req, res) => {
    const { email, password }= req.body

    //check for user email
    const user= await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials.')
    }

})

// @desc Get user data
// @route POST api/users/me
// @access Private
const getMe= asyncHandler(async (req, res) => {

    //we don't need to do this here because we already found user by 'id' and excluded the password field in our 'authMiddleware.js'
    // const { _id, name, email }= await User.findById(req.user.id)
    
    // res.status(200).json({
    //     id: _id,
    //     name,
    //     email
    // })

    //Instead we just send req.user directly
    res.status(200).json(req.user)
})

// Generate JWT Token
const generateToken= (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}