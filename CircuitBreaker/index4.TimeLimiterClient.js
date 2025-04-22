const express = require('express');
const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const Bottleneck = require('bottleneck');
const CircuitBreaker = require('opossum');

const app = express();

// 🔁 Retry khi timeout hoặc lỗi 5xx
axiosRetry(axios, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  shouldRetry: (error) => {
    return error.code === 'ECONNABORTED' || error.response?.status >= 500;
  }
});

// 🔒 Rate Limiter: giới hạn 1 request mỗi giây
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

// 🕒 Hàm gọi dịch vụ Order với timeout
async function callOrderServiceWithTimeout() {
  return new Promise((resolve, reject) => {
    // Đặt timeout 2 giây cho request
    const timeoutId = setTimeout(() => reject('⏰ Request timed out!'), 2000);

    limiter.schedule(() => 
      axios.get('https://echoapp-rho.vercel.app/api/users')
    ).then(res => {
      clearTimeout(timeoutId);  // Hủy timeout nếu thành công
      resolve(res.data);
    }).catch((err) => {
      clearTimeout(timeoutId);  // Hủy timeout nếu có lỗi
      reject(err);
    });
  });
}

// ⚡ Circuit Breaker
const breaker = new CircuitBreaker(callOrderServiceWithTimeout, {
  timeout: 3000, // Timeout cho CircuitBreaker
  errorThresholdPercentage: 50,
  resetTimeout: 5000,
});

// Log trạng thái circuit
breaker.on('open', () => console.log('🚫 Circuit is OPEN'));
breaker.on('halfOpen', () => console.log('🟡 Circuit is HALF-OPEN'));
breaker.on('close', () => console.log('✅ Circuit is CLOSED'));

// 📦 Route test
app.get('/product/:productId/orders', async (req, res) => {
  try {
    const data = await breaker.fire();
    res.json(data);
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

app.listen(3004, () => {
  console.log('✅ Product service running on port 3004');
});
