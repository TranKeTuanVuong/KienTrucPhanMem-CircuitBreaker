// const express = require('express');
// const axios = require('axios');
// const axiosRetry = require('axios-retry').default;
// const CircuitBreaker = require('opossum');
// const Bottleneck = require('bottleneck');

// const app = express();

// // 🔁 Retry
// axiosRetry(axios, {
//   retries: 3,
//   retryDelay: axiosRetry.exponentialDelay,
//   shouldRetry: (error) => {
//     return error.response === undefined || error.response.status >= 500;
//   },
// });

// // 🔒 Rate Limiter
// const limiter = new Bottleneck({
//   maxConcurrent: 1,
//   minTime: 1000
// });

// // 🎯 Hàm gọi dịch vụ Order
// async function callOrderService() {
//   console.log('⏳ Calling external Order Service...');
//   return limiter.schedule(() =>
//     axios.get('https://echoapp-rho.vercel.app/api/users')
//   ).then(res => res.data);
// }

// // ⚡ Circuit Breaker
// const breaker = new CircuitBreaker(callOrderService, {
//   timeout: 3000,
//   errorThresholdPercentage: 50,
//   resetTimeout: 5000
// });

// // 🔄 Log trạng thái circuit
// breaker.on('open', () => console.log('🚫 Circuit is OPEN'));
// breaker.on('halfOpen', () => console.log('🟡 Circuit is HALF-OPEN'));
// breaker.on('close', () => console.log('✅ Circuit is CLOSED'));

// // 📦 API Endpoint gọi thật
// app.get('/product/:productId/orders', async (req, res) => {
//   try {
//     const data = await breaker.fire();
//     res.json(data);
//   } catch (err) {
//     console.error('Circuit breaker error:', err.message);
//     res.status(500).json({ message: 'Dịch vụ đơn hàng không sẵn sàng. Vui lòng thử lại sau!' });
//   }
// });

// // 📦 Test route: gọi liên tiếp 5 lần
// app.get('/test', async (req, res) => {
//   const results = [];

//   for (let i = 0; i < 5; i++) {
//     try {
//       console.log(`🔁 Request ${i + 1}`);
//       const data = await breaker.fire();
//       results.push({ index: i + 1, success: true, data });
//     } catch (err) {
//       results.push({ index: i + 1, success: false, error: err.message });
//     }
//   }

//   res.json(results);
// });

// app.listen(3003, () => {
//   console.log('🚀 Product service running on port 3003');
// });
const express = require('express');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const CircuitBreaker = require('opossum');
const Bottleneck = require('bottleneck');

const app = express();

// 🔁 Retry với axios
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldRetry: (error) => {
    return error.response === undefined || error.response.status >= 500;
  },
});

// 🔒 Rate Limiter: 1 request / giây
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

// 🎯 Hàm gọi dịch vụ Order - có random lỗi
async function callOrderService() {
  const random = Math.random();
  if (random < 0.5) {
    console.log('💥 Simulated failure');
    throw new Error('Simulated Service Failure');
  }

  console.log('✅ Simulated success');
  return limiter.schedule(() =>
    axios.get('https://echoapp-rho.vercel.app/api/users')
  ).then(res => res.data);
}

// ⚡ Circuit Breaker
const breaker = new CircuitBreaker(callOrderService, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 3000
});

// 🔄 Log trạng thái circuit
breaker.on('open', () => console.log('🚫 Circuit is OPEN'));
breaker.on('halfOpen', () => console.log('🟡 Circuit is HALF-OPEN'));
breaker.on('close', () => console.log('✅ Circuit is CLOSED'));

// 🧪 Test gọi 10 lần liên tục
app.get('/test', async (req, res) => {
  const results = [];

  for (let i = 0; i < 10; i++) {
    try {
      console.log(`🔁 Request ${i + 1}`);
      const data = await breaker.fire();
      results.push({ index: i + 1, success: true, data });
    } catch (err) {
      results.push({ index: i + 1, success: false, error: err.message });
    }
  }

  res.json(results);
});

// 🟢 Khởi động server
app.listen(3003, () => {
  console.log('✅ Product service running on port 3003');
});
