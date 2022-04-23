const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


mongoClient.connect(connectionURL, (error, client) => {
    
    if (error)
    {
        console.log('unable to connect to databse')
        return
    }
    
    console.log('connected to database')

    const db = client.db(databaseName)

    //db.collection('tasks').updateMany({ completed: true }, { $set: { completed: false }}).then((result) => { console.log(result)}).catch((result) => { console.log(result)})
    db.collection('tasks').deleteOne({ description: "task2 description"}).then((result) => { console.log("Success: " + JSON.stringify(result))}).catch((result) => { console.log("Fail: " + JSON.stringify(result))})

})



