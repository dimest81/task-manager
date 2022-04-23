const express = require('express')
const taskRouter = require('./tasks-router.js');
const userRouter = require('./user-router.js')
const app = express()
const appStatus = process.env.APP_STATUS


if (appStatus === 'OPERATIONAL')
{
    app.use(express.json())
    app.use(userRouter)
    app.use(taskRouter)
}
else
{
    app.use((req, res, next) => {
       res.status(503)
       res.send("currently under maintenance") 
    })
}

module.exports = app