const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const db = require('./db_setup')

beforeEach(async () => { 
    await db.setup()
})


test('user login test existing user', async () => {
    await request(app)
    .post('/users/login')
    .send(db.User1)
    .expect(200)
})

test('user login test non existent user', async () => {
    await request(app)
          .post('/users/login')
          .send(db.User2)
          .expect(500)
})

test('user profile for existing user', async () => {  
    await request(app)
          .get('/users/me')
          .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
          .send()
          .expect(200)    
   
})

test('user profile for non existing user', async () => {
    await request(app)
          .get('/users/me')
          .set('Authorization', 'Bearer ' + db.User2.tokens[0].token)
          .send()
          .expect(401)
})

test('patch existing user', async () => {
    
    const User_patch = {
        email: 'dimest81@gmail.com'
    }

    await request(app)
          .patch('/users/me')
          .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
          .send(User_patch)
          .expect(200)    
})

test('patch existing user not valid email', async () => {
    
    const User_patch = {
        email: 'dimest81'
    }

    await request(app)
          .patch('/users/me')
          .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
          .send(User_patch)
          .expect(500)    
})

test('patch non existing user', async () => {

    const User_patch = {
        email: 'dimest81@gmail.com'
    }

    await request(app)
          .patch('/users/me')
          .set('Authorization', 'Bearer ' + db.User2.tokens[0].token)
          .send(User_patch)
          .expect(401) 
})

test('delete existing user', async () => {
    await request(app)
          .patch('/users/me')
          .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
          .send()
          .expect(200) 
})

test('delete non existing user', async () => {
    await request(app)
          .patch('/users/me')
          .set('Authorization', 'Bearer ' + db.User2.tokens[0].token)
          .send()
          .expect(401) 
})

test('attach avatar to existing user', async () => {
    await request(app)
          .patch('/users/me/avatar')
          .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
          .attach('avatar', 'C:\\Users\\dimitar.stojanovski\\Downloads\\node-course-images\\profile-pic.jpg')
          .expect(200)
          
    const user = await User.findById(db.user1Id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('attach very large avatar to existing user', async () => {
    await request(app)
          .patch('/users/me/avatar')
          .set('Authorization', 'Bearer ' + db.User1.tokens[0].token)
          .attach('avatar', 'C:\\Users\\dimitar.stojanovski\\Downloads\\node-course-images\\fall.jpg')
          .expect(400)
})
