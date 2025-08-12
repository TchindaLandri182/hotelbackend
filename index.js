require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT
const CLIENT_URL = process.env.CLIENT_URL
const {app, server} = require('./socket')

const hotelRoute = require('./routes/hotel.route')
const userRoute = require('./routes/user.route')
const categoryRoute = require('./routes/roomCategory.route')
const roomRoute = require('./routes/room.route')

app.use(bodyParser.json())
app.use(cors(/*{ credentials: true, origin: CLIENT_URL }*/))
app.use(cookieParser())


app.use('/api/hotel', hotelRoute)
app.use('/api/user', userRoute)
app.use('/api/category', categoryRoute)
app.use('/api/room', roomRoute)

// app.get('/images/:imagename', (req, res) => {
//     const imagename = req.params.imagename;
//     const imagePath = path.join(__dirname, 'images', imagename);
//     res.sendFile(imagePath);
// });


// app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
mongoose.connect(process.env.MONGOOSE_CONNECTION_URL)
.then(() => {
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
}).catch((error) => console.error(error))
