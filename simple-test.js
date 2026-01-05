const http = require('http');

console.log('=== ПРОСТОЙ ТЕСТ API ===\n');

// Проверяем основные endpoint'ы
const endpoints = [
  '/api/health',
  '/api/libraries', 
  '/api/libraries/books/popular',
  '/api/libraries/stats/counts'
];

let passed = 0;
let failed = 0;

function testEndpoint(url) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${url}: OK (HTTP ${res.statusCode})`);
        passed++;
      } else {
        console.log(`❌ ${url}: FAILED (HTTP ${res.statusCode})`);
        failed++;
      }
      resolve();
    }).on('error', () => {
      console.log(`❌ ${url}: CONNECTION FAILED`);
      failed++;
      resolve();
    }).setTimeout(3000, function() {
      this.destroy();
      console.log(`❌ ${url}: TIMEOUT`);
      failed++;
      resolve();
    });
  });
}

async function runAllTests() {
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }

  console.log('\n=== РЕЗУЛЬТАТ ===');
  console.log(`Пройдено: ${passed}/${endpoints.length}`);
  console.log(`Провалено: ${failed}/${endpoints.length}`);
  
  if (failed === 0) {
    console.log('\n��� ВСЕ ТЕСТЫ ПРОЙДЕНЫ! API работает корректно.');
  } else {
    console.log('\n⚠️  Есть проблемы с некоторыми endpoint\'ами.');
  }
}

runAllTests();
