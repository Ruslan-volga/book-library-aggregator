const http = require('http');

function checkHealth() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/health', (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function getStats() {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/api/libraries/stats/counts', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({ totalLibraries: 0, totalBooks: 0 });
        }
      });
    }).on('error', () => {
      resolve({ totalLibraries: 0, totalBooks: 0 });
    });
  });
}

async function monitor() {
  console.log('��� МОНИТОРИНГ API БИБЛИОТЕК');
  console.log('Нажмите Ctrl+C для остановки\n');

  while (true) {
    const timestamp = new Date().toLocaleTimeString();
    const isHealthy = await checkHealth();
    const stats = await getStats();

    process.stdout.write('\x1b[2K\r'); // Очищаем строку
    
    if (isHealthy) {
      process.stdout.write(`��� ${timestamp} | API: РАБОТАЕТ | ��� Библиотек: ${stats.totalLibraries} | ��� Книг: ${stats.totalBooks}`);
    } else {
      process.stdout.write(`��� ${timestamp} | API: НЕ ДОСТУПЕН`);
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); // Ждем 5 секунд
  }
}

monitor().catch(console.error);
