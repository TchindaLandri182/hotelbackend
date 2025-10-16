require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;
const {app, server} = require('./socket');

const requestLogger = require("./middlewares/requestLogger");

// Import routes
const hotelRoute = require('./routes/hotelRoute');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoomRoute');
const roomRoute = require('./routes/roomRoute');
const clientRoute = require('./routes/clientRoute');
const foodItemRoute = require('./routes/foodItemRoute');
const stayRoute = require('./routes/stayRoute');
const invoiceRoute = require('./routes/invoiceRouter');
const orderItemRoute = require('./routes/orderItemRoute');
const pricePeriodRoute = require('./routes/pricePeriodRouter');
const zoneRoute = require('./routes/zoneRoute');
const logRoute = require('./routes/logRoute');
const dashboardRoute = require('./routes/dashboardRoute')

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use(requestLogger);

// Routes
app.use('/api/hotel', hotelRoute);
app.use('/api/user', userRoute);
app.use('/api/category', categoryRoute);
app.use('/api/room', roomRoute);
app.use('/api/client', clientRoute);
app.use('/api/food-item', foodItemRoute);
app.use('/api/stay', stayRoute);
app.use('/api/invoice', invoiceRoute);
app.use('/api/order-item', orderItemRoute);
app.use('/api/price-period', pricePeriodRoute);
app.use('/api/zone', zoneRoute);
app.use('/api/log', logRoute);
app.use('/api/dashboard', dashboardRoute)

// Database connection and server start
mongoose.connect(process.env.MONGOOSE_CONNECTION_URL)
.then(() => {
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}).catch((error) => console.error(error));