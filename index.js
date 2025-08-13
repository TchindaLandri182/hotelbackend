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

// Import routes
const hotelRoute = require('./routes/hotelRoute');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoomRoute');
const roomRoute = require('./routes/roomRoute');
const clientRoute = require('./routes/clientRoute');
const foodItemRoute = require('./routes/foodItemRoute');
const stayRoute = require('./routes/stayRoute');
const invoiceRoute = require('./routes/invoiceRoute');
const orderItemRoute = require('./routes/orderItemRoute');
const pricePeriodRoute = require('./routes/pricePeriodRoute');
const zoneRoute = require('./routes/zoneRoute');
const regionRoute = require('./routes/regionRoute');
const cityRoute = require('./routes/cityRoute');
const countryRoute = require('./routes/countryRoute');
const logRoute = require('./routes/logRoute');

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

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
app.use('/api/region', regionRoute);
app.use('/api/city', cityRoute);
app.use('/api/country', countryRoute);
app.use('/api/log', logRoute);

// Database connection and server start
mongoose.connect(process.env.MONGOOSE_CONNECTION_URL)
.then(() => {
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}).catch((error) => console.error(error));