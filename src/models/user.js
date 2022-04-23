const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({  
    name: { 
        type: String,
        required: true,
        trim: true
    },
    password : {
        type: String,
        required: true,
        trim: true,
        validate(value)
        {
            if (value.length < 6)
            {
                throw new Error('password should be at least 6 characters long')
            }
        }
    },
    email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         validate(value)
         {
             if (!validator.isEmail(value))
             {
                 throw new Error('not valid email address')
             }
         }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    avatar: {
        type: Buffer
    }
}, { 
    timestamps: true
})

userSchema.statics.findByCredentials = async (_email, _password) => {

    const user = await User.findOne({ email: _email})
    
    if (!user)
    {
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(_password, user.password)
    
    if (!isMatch)
    {
        throw new Error('unable to login')
    }

    return user
}

userSchema.pre('save', async function(next) {
    
    const user = this

    if (user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next) {
    
    try
    { 
        const user = this
        await Task.deleteMany({ owner: user._id })
        next()
    }
    catch (e)
    {
        throw e
    } 
})

userSchema.methods.getPublicProfile = async function() {

    const user = this
    const userObject = new Object()
    userObject.name = user.name
    userObject.email = user.email
    return userObject
}

userSchema.methods.generateAuthToken = async function() {

    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User