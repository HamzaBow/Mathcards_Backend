require('dotenv').config()

const express = require('express')
const serverless = require("serverless-http")
const app = express()
const cors = require('cors')
app.use(
  cors({
    // origin: 'http://localhost:3000'
    // origin: 'https://clever-agnesi-cbde7c.netlify.app'
    origin: '*',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
)
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
// mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello, this is home')
})

// ******************* Routers *******************
const cardsRouter       = require('./routes/cards')
const usersRouter       = require('./routes/users')
const collectionsRouter = require('./routes/collections')
const tagsRouter        = require('./routes/tags')
// ****************** Serverless *****************

app.use('/.netlify/functions/server/cards',       cardsRouter)
app.use('/.netlify/functions/server/users',       usersRouter)
app.use('/.netlify/functions/server/collections', collectionsRouter)
app.use('/.netlify/functions/server/tags',        tagsRouter)
// **************** Not Serverless ***************
// app.use('/cards',       cardsRouter)
// app.use('/users',       usersRouter)
// app.use('/collections', collectionsRouter)
// app.use('/tags',        tagsRouter)
// ***********************************************

module.exports = app;
module.exports.handler = serverless(app);
