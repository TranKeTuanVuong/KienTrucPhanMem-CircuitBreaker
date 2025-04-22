const express = require('express');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const CircuitBreaker = require('opossum');

const app = express(); // <== QUAN TRỌNG

// Cấu hình retry cho axios
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldRetry: (error) => {
    return error.response === undefined || error.response.status === 500;
  },
});

// Hàm gọi dịch vụ Order
async function callOrderService() {
  const response = await axios.get('https://echoapp-rho.vercel.app/api/users');
  return response.data;
}

// Cấu hình Circuit Breaker
const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 5000
};

const breaker = new CircuitBreaker(callOrderService, options);

breaker.on('open', () => console.log('Circuit is OPEN'));
breaker.on('halfOpen', () => console.log('Circuit is HALF-OPEN'));
breaker.on('close', () => console.log('Circuit is CLOSED'));

// Endpoint test circuit breaker
app.get('/product/:productId/orders', async (req, res) => {
  try {
    const orderData = await breaker.fire();
    res.json(orderData);
  } catch (err) {
    console.error('Circuit breaker error:', err.message);
    res.status(500).json({ message: 'Dịch vụ đơn hàng không sẵn sàng. Vui lòng thử lại sau!' });
  }
});

app.listen(3002, () => {
  console.log('Product service running on port 3002');
});
