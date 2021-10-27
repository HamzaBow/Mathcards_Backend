require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello, this is home')
})

// ******************* Routers *******************
const cardsRouter = require('./routes/cards', )
app.use('/cards', cardsRouter)

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)
// ***********************************************

app.listen(3001,  () => console.log('Server Started'))