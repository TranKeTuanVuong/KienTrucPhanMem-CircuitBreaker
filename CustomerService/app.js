// app.js
const express = require('express');
const mongoose = require('mongoose');
const CustomerRoutes = require('./routers/index');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/customer', CustomerRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT||4997, () => console.log('Product Service running on port 3001'));
  });
