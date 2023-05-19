const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middlewares/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

//connect to the MongoDB database
connectDB()

const app = express()

//MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

//serve frontend  :  when we do a prodcution build, React builds our static assets in a 'build' folder of frontend.So we pass the location here as shown.
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    //specify the entry point 'index.html'
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html'))
    })
} else {
    app.get('/', (req, res) => res.send('Please set to production mode.'))
}

//midware for errorHandling
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))