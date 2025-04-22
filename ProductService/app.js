// app.js
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routers/Product.routers');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/products', productRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 4999, () =>
      console.log(`Product Service running on port ${process.env.PORT || 4999}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
