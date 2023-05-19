const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// @desc Get goals
// @route GET /api/goals
// @access Private
const getGoals= asyncHandler(async (req, res) => {

    //retrives all goals of current userID
    const goals= await Goal.find({ user: req.user.id })

    res.status(200).json(goals)
})

// @desc Set goal
// @route POST /api/goals
// @access Private
const setGoal= asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400)
        throw new Error('Please add a text field.')
    }

    // create a goal and get the text value from body of the user's request.And post it to DB
    const goal= await Goal.create({
        text: req.body.text,

        //assigns a specific user to a goal 
        user: req.user.id
    })

    console.log(goal)

    res.status(200).json(goal)
})

// @desc Update goals
// @route PUT /api/goals/:id
// @access Private
const updateGoal= asyncHandler(async (req, res) => {
    const goal= await Goal.findById(req.params.id)

    // if goal to be updated is not found, return an Error
    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    //we dont do this as we have already did this in authMiddlware.js
    // const user= await User.findById(req.user.id)
    
    //check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    //make sure the logged in user matches the goal user
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Unauthorised user')
    }

    const updatedGoal= await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json(updatedGoal)
})

// @desc Delete goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal= asyncHandler(async (req, res) => {
    const goal= await Goal.findById(req.params.id)

    // if goal to be updated is not found, return an Error
    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    //again as we have already fetched user by id in req.user (and excluded the pswrd), in authMiddleware.js . SO we don't do this
    // const user= await User.findById(req.user.id)
    
    //check for user
    if(!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    //make sure the logged in use matches the goal user
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Unauthorised user')
    }

    await Goal.findByIdAndDelete(req.params.id)

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
}