const express = require('express')
const User = require('./models/user')
const mongoose = require('./db/mongoose')
const auth = require('./middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()
const upload = multer({  
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error('please update an image'))
        }

        cb(undefined,true)
    }
})

router.get('/users/me/avatar', auth, async (req,res) => {
    
    try
    {
        const user = req.user
        
        if (!user || !user.avatar) 
        {
            res.status(404)
            res.send()
        }
        else
        {
            res.set('Content-Type','image/png')
            res.send(user.avatar)
        }
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }
})

router.patch('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400)
    res.send( { error: error.message })
})

router.post('/users/login',  async (req,res) => {

    try
    {
        const user = await User.findByCredentials(req.body.email, req.body.password)
    
        if (user)
        {
            const token = await user.generateAuthToken()
            res.status(200)    
            res.send({ user: await user.getPublicProfile(), token: token })
        }
        else
        {
            res.status(400)
            res.send()
        }
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }

})

router.post('/users/logout', auth, async (req,res) => {

    try
    {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.status(200)
        res.send()
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }

})

router.post('/users/logoutAll', auth, async (req,res) => {

    try
    {
        req.user.tokens = []
        await req.user.save()
        res.status(200)
        res.send()
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }

})

router.post('/users/signup', async (req,res) => {

    try
    {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(200) 
        res.send({ user, token })
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }
})

router.delete('/users/me', auth, async (req,res) => {

    try
    {  
        await req.user.remove()
        res.status(200)
        res.send(await req.user.getPublicProfile())
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }

})

router.delete('/users/me/avatar', auth, async (req,res) => {

    try
    {
        req.user.avatar = undefined
        await req.user.save()
        res.status(200)
        res.send()
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }
})

router.patch('/users/me', auth, async (req,res) => {

    try
    {
        const allowedFields = ['name', 'password', 'email']
        const updates = Object.keys(req.body)
        
        const isValidOperation = updates.every((update) => {
            return allowedFields.includes(update)  
        })

        if (!isValidOperation)
        {
            res.status(400)
            res.send({ error: 'check fields in request body'})
            return
        }
      
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
             
        res.status(200)
        res.send(await req.user.getPublicProfile())       
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }
})

router.get('/users/me', auth, async (req,res) => {

    res.status(200)
    res.send(req.user)

})

module.exports = router
