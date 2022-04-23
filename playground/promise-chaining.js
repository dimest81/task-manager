const mongoose = require('../src/db/mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')

const updatePasswordAndCount = async (id, new_password) => {
    const user = await User.findByIdAndUpdate(id, { password: new_password} )
    const count = await User.countDocuments( { _id: id })

    return count
}

//updatePasswordAndCount('6166c0c33c95dff296f4418b','crc').then((count) => {console.log(count)}).catch((e) => { console.log(e) })

//Task.insertMany([ { description: 'task1', completed: true} , {description: 'task2', completed: false}])

const deleteTaskByIdAndCount = async (id) => {
    await Task.deleteOne({ _id: id })
    const count = await Task.countDocuments()
    return count
}

deleteTaskByIdAndCount('616fc8ce301102b36c87d509').then((count) => { console.log("number of tasks in database: " + count)}).catch((e) => { console.log(e)})