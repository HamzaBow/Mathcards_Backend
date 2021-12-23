require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
)
const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI)
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

const collectionsRouter = require('./routes/collections')
app.use('/collections', collectionsRouter)

const tagsRouter = require('./routes/tags')
app.use('/tags', tagsRouter)
// ***********************************************

app.listen(3001,  () => console.log('Server Started'))

