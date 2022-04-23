const express = require('express')
const taskRouter = require('./tasks-router.js');
const userRouter = require('./user-router.js')
const app = require('./app')
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => { 
    console.log('listening on port: ' + port)
})

