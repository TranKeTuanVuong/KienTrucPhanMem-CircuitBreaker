const express = require('express');
const axios = require('axios');
const CircuitBreaker = require('opossum');

const app = express();

// Hàm gọi dịch vụ Order
async function callOrderService() {
  const response = await axios.get('https://echoapp-rho.vercel.app/api/users');
  return response.data;
}

// Cấu hình Circuit Breaker
const options = {
  timeout: 3000, // Timeout sau 3 giây
  errorThresholdPercentage: 50, // 50% yêu cầu thất bại sẽ mở circuit breaker
  resetTimeout: 5000 // Thử lại sau 5 giây
};

const breaker = new CircuitBreaker(callOrderService, options);

// Các sự kiện của Circuit Breaker
breaker.on('open', () => console.log('Circuit is OPEN'));
breaker.on('halfOpen', () => console.log('Circuit is HALF-OPEN'));
breaker.on('close', () => console.log('Circuit is CLOSED'));

// API endpoint trong Express
app.get('/product/:productId/orders', async (req, res) => {
  //const productId = req.params.productId;

  try {
    const orderData = await breaker.fire(); // Gọi dịch vụ với circuit breaker
    res.json(orderData); // Trả dữ liệu nếu thành công
  } catch (err) {
    console.error('Circuit breaker error:', err.message);
    res.status(500).json({ message: 'Dịch vụ đơn hàng không sẵn sàng. Vui lòng thử lại sau!' });
  }
});

// Chạy server
app.listen(3001, () => {
  console.log('Product service running on port 3001');
});
