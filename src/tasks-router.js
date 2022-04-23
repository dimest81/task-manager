const express = require('express')
const Task = require('./models/task')
const mongoose = require('./db/mongoose')
const auth = require('./middleware/auth')
const queryHelper = require('./middleware/query-helper')

const router = new express.Router()

router.get('/tasks', auth, async (req,res) => {
   
    try
    {
        var filterQuery = {owner: req.user._id}
        if (req.query.filter)
        {
            const filter_parameters = [{ name: 'completed', type: 'boolean' },{ name: 'description', type: 'string' },{ name: 'createdAt', type: 'date'},{ name: '_id', type: 'guid'}]      
            queryHelper.buildFilterQuery(req.query.filter, filter_parameters, filterQuery)
        }

        const options = {} 
        queryHelper.buildQueryOptions(req.query, options)

        const tasks = await Task.find(filterQuery, null, options)
        
        res.status(200)
        res.send(tasks)
    }
    catch(e)
    {
        res.status(500)
        res.send(e)
    }

})

router.get('/tasks/:id', auth, async (req,res) => {

    try
    {
        const id = req.params.id
        const task = await Task.findOne({ owner: req.user._id, _id: id })

        if (!task)
        {
            res.status(404)
            res.send()
        }
        else
        {
            res.status(200)
            res.send(task)
        }
    }
    catch(e)
    {
        res.status(500)
        res.send(e)
    }

})

router.post('/tasks', auth, async (req,res) => {
    
    try
    {
        const task = new Task({ 
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(200)
        res.send(task) 
    }
    catch(e)
    {
        res.status(500)
        res.send(e)
    }

})

router.patch('/tasks/:id', auth, async (req,res) => {

    try
    {
        const allowedFields = ['description', 'completed']
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

        const id = req.params.id
        const task = await Task.findOne({ owner: req.user._id, _id: id })

        if (!task)
        {
            res.status(404)
            res.send()
        }
        else
        {
            updates.forEach((update) => {
                task[update] = req.body[update]
            })
            await task.save()
            res.status(200)
            res.send(task)
        }
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {

    try
    {  
        const id = req.params.id
        const task = await Task.findOneAndDelete({ owner: req.user._id, _id: id })

        if (!task)
        {
            res.status(404)
            res.send()
        }
        else
        {
            res.status(200)
            res.send(task)
        }
    }
    catch(e)
    {
        res.status(500) 
        res.send(e)
    }

})

module.exports = router