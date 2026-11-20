require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 5000
const uri = process.env.URI

if(!uri)
{
    console.log('MongoDB uri not found')
    process.exit()
}

mongoose.connect(uri, {serverSelectionTimeoutMS: 5000}).then(() =>
{
    console.log('Server connected to MongoDB')
}).catch((err) =>
{
    console.log(err.message)
    process.exit()
})

const studentSchema = new mongoose.Schema
(
    {
        _id:
        {
            type: String,
            trim: true,
            minLength: 8,
            maxLength: 8,
            required: true
        },
        firstName:
        {
            type: String,
            trim: true,
            maxLength: 100,
            required: true
        },
        middleName:
        {
            type: String,
            trim: true,
            maxLength: 100
        },
        lastName:
        {
            type: String,
            trim: true,
            maxLength: 100,
            required: true
        }
    }
)

const balanceSchema = new mongoose.Schema
(
    {
        studentId:
        {
            type: String,
            trim: true,
            minLength: 8,
            maxLength: 8,
            required: true
        },
        semester:
        {
            type: Number,
            min: 1,
            max: 2,
            required: true
        },
        schoolYear:
        {
            type: String,
            trim: true,
            minLength: 9,
            maxLength: 9,
            required: true
        },
        courses:
        {
            type: [],
            required: true
        },
        misc:
        {
            type: [],
            required: true
        }
    }
)

const Student = mongoose.model('Student', studentSchema)
const Balance = mongoose.model('Balance', balanceSchema)

app.get('/api/balance/read', async (req, res) =>
{
    try
    {
        return res.status(200).json(await Balance.find().lean())
    }
    catch(err)
    {
        console.log(`Error: ${err.message}`)
        return res.status(500).send()
    }
})

app.post('/api/finance/create', async (req, res) =>
{
    try
    {
        const {studentNumber, firstName, middleName, lastName} = req.body
        if(studentNumber < 1 || studentNumber > 1000)
        {
            return res.status(400).send()
        }
        await Student.create({_id: `${new Date().getFullYear()}-${String(studentNumber).padStart(3, 0)}`, firstName, middleName, lastName})
        return res.status(201).send()
    }
    catch(err)
    {
        if(err.name == 'ValidationError' || err.name == 'CastError')
        {
            return res.status(400).send(err.message)
        }
        if(err.code == 11000)
        {
            return res.status(409).send('Student ID already exists')
        }
        console.log(`Error: ${err.message}`)
        return res.status(500).send()
    }
})

app.post('/api/finance/new-balance', async (req, res) =>
{
    try
    {
        const {studentId, semester} = req.body
        await Balance.create({studentId, semester, schoolYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`, courses: [], misc: []})
        return res.status(201).send()
    }
    catch(err)
    {
        if(err.name == 'ValidationError' || err.name == 'CastError')
        {
            return res.status(400).send(err.message)
        }
        console.log(`Error: ${err.message}`)
        return res.status(500).send()
    }
})

app.post('/api/finance/add-course', async (req, res) =>
{
    try
    {
        const {id, course, amount} = req.body
        const entry = await Balance.findById(id)
        if(!entry){return res.status(404).send()}
        entry.courses.push({id, course, amount, paid: 0})
        await entry.save()
        return res.status(200).send()
    }
    catch(err)
    {
        if(err.name == 'ValidationError' || err.name == 'CastError')
        {
            return res.status(400).send(err.message)
        }
        console.log(`Error: ${err.message}`)
        return res.status(500).send()
    }
})

app.post('/api/finance/course/pay', async (req, res) =>
{
    try
    {
        const {id, x, paid} = req.body
        const entry = await Balance.findById(id)
        if(!entry){return res.status(404).send()}
        const value = (Math.round(entry.courses[x].paid * 100) + Math.round(paid * 100)) / 100
        if(entry.courses[x].amount >= value)
        {
            entry.courses[x].paid = value
            entry.markModified('courses')
            await entry.save()
            return res.status(200).send()
        }
        return res.status(400).send()
    }
    catch(err)
    {
        if(err.name == 'ValidationError' || err.name == 'CastError')
        {
            return res.status(400).send(err.message)
        }
        console.log(`Error: ${err.message}`)
        return res.status(500).send()
    }
})

app.listen(port, () =>
{
    console.log(`Server activated\nPort: ${port}`)
})