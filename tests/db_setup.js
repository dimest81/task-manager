const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')

const user1Id = new mongoose.Types.ObjectId()
const user2Id = new mongoose.Types.ObjectId()
const task1Id = new mongoose.Types.ObjectId()

const User1 = {
    _id: user1Id,
    name: 'Dimitar',
    email: 'dimest81@gmail.com',
    password: 'lozinka123456',
    tokens: [ { 
        token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET)
    }]
}

const User2 = {
    _id: user2Id,
    name: 'Sofija',
    email: 'sofija_z@gmail.com',
    password: '3453534534',
    tokens: [ {
        token: jwt.sign({ _id: user2Id }, process.env.JWT_SECRET)
     }]
}

const Task1 = {
    _id: task1Id,
    description : 'opis na test taskot',
    completed: true,
    owner : user1Id
}

const setup = async () => {
    await User.deleteMany()
    await new User(User1).save()
}

module.exports =  {setup, User1, user1Id, User2, user2Id, Task1, task1Id}