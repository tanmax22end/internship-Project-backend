const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
const PORT = 4000
const path = require('path')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
let Todo = require('./join.model');
mongoose.connect('mongodb://127.0.0.1:27017/exp1', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

const JWT_S = 'jkhsfkjdsghfjskldhdskvjlkfhvkjso897e9836r798980987767e'

app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'static')))

app.post('/api/home', (req, res) => {

    const { token } = req.header
    const user = jwt.verify(token, JWT_S)
    console.log(user)
    if (!user) {
        return res.json({ status: 'error', error: 'Invalid email/password' })
    }else {
        return res.json({ status: 'success' })

    }
})

app.post('/api/login', async (req, res) => {

    const { email, Password } = req.body

    const user = await Todo.findOne({ email }).lean()

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid email/password' });
    }
    if (await bcrypt.compare(Password, user.Password)) {

        const token = jwt.sign({ id: user._id, email: user.email },JWT_S)

        return res.json({ status: 'ok', data: token })

    }
    return res.json({ status: 'error', error: 'Invalid email/password' });
    res.json({ status: 'ok', data: "hello" })

})

app.post('/api/register', async (req, res) => {
    console.log(req.body)

    const { name, email, password } = req.body
    console.log(await bcrypt.hash(password, 10))
    const Password = await bcrypt.hash(password, 10)
    console.log(Password)
    try {
        const response = await Todo.create({
            name,
            email,
            Password,
        })
        console.log('User Created successfully: ', response)
    } catch (error) {
        console.log(error)
        return res.json({ status: 'error' })
    }

    res.json({ status: 'ok' })

})

app.listen(PORT, function () {
    console.log("server is running on: " + PORT)
});