const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');

const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
const db = require("./config/db")
db.connect()

const myRoute = require('./routes/my_routes')
app.use(['/', '/home'], myRoute)

app.use('/product/:productType', myRoute)


app.use('/product/:productType/:productID', myRoute)
app.post('/payment', myRoute)
app.post('/sign-in', myRoute)
app.post('/sign-up', myRoute)
app.listen(port)