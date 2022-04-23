const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const db = require('./db_setup')

beforeEach(async () => { 
    await db.setup()
})

test('create task for existing user', async() => {
    await request(app)
    .post('/tasks')
    .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
    .send(db.Task1)
    .expect(200)
})

test('create task for non existing user', async() => {
    await request(app)
    .post('/tasks')
    .set('Authorization', 'Bearer ' + db.User2.tokens[0].token)
    .send(db.Task1)
    .expect(401)
})

test('get task for existing user', async() => {
    var response = await request(app)
    .get('/tasks')
    .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
    .send()
    .expect(200)

    expect(response.body.length).toEqual(1)
})

test('get task for non existing user', async() => {
    await request(app)
    .get('/tasks')
    .set('Authorization', 'Bearer ' + db.User2.tokens[0].token)
    .send()
    .expect(401)
})

test('find task for existing user by id', async() => {
    var response = await request(app)
    .get('/tasks/' + db.task1Id)
    .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
    .send()
    .expect(200)
})

test('find non existing task for existing user by id', async() => {
    var response = await request(app)
    .get('/tasks/' + db.user1Id)
    .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
    .send()
    .expect(404)
})

test('find task for existing user by id', async() => {
    var response = await request(app)
    .get('/tasks/' + db.task1Id)
    .set('Authorization', 'Bearer ' + db.User2.tokens[0].token)
    .send()
    .expect(401)
})