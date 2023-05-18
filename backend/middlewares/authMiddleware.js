const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect= asyncHandler(async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //get token from header
            token= req.headers.authorization.split(' ')[1]

            //verify token and decode it. Note that we have passed 'id' as our payload, so decoded token will have 'id'
            const decoded= jwt.verify(token, process.env.JWT_SECRET)

            //Get user from token. '-password' excludes the password in returned object
            req.user= await User.findById(decoded.id).select('-password')

            //call next() to execute next() piece of midware
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized.')
        }
    }

    //check if no token is found, display below error
    if(!token) {
        res.status(401)
        throw new Error('Not authorized, no token.')
    }
})

module.exports = { protect }

//to use this protect middleware, add it to userRoutes as second argument in router.get() functions