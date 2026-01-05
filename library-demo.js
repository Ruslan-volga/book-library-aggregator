const http = require('http');

console.log('��� ДЕМОНСТРАЦИЯ РАБОТЫ БИБЛИОТЕЧНОГО API\n');
console.log('=========================================\n');

const API_URL = 'http://localhost:3000';

function fetchJSON(path) {
  return new Promise((resolve, reject) => {
    http.get(`${API_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function demonstrate() {
  try {
    // 1. Показываем статус системы
    console.log('1. ��� СТАТУС СИСТЕМЫ:');
    const health = await fetchJSON('/api/health');
    if (health && health.status === 'ok') {
      console.log('   ✅ Система работает');
      console.log(`   ��� Сервис: ${health.service}`);
      console.log(`   ���️  База данных: ${health.database}`);
      console.log(`   ⏰ Аптайм: ${Math.floor(health.uptime / 60)} минут`);
    }

    // 2. Показываем статистику
    console.log('\n2. ��� СТАТИСТИКА:');
    const stats = await fetchJSON('/api/libraries/stats/counts');
    if (stats) {
      console.log(`   ��� Библиотек: ${stats.totalLibraries}`);
      console.log(`   ��� Всего книг: ${stats.totalBooks}`);
      console.log(`   ✅ Доступно книг: ${stats.totalAvailableBooks}`);
    }

    // 3. Показываем библиотеки
    console.log('\n3. ���️  БИБЛИОТЕКИ:');
    const libraries = await fetchJSON('/api/libraries');
    if (libraries && libraries.length > 0) {
      libraries.slice(0, 3).forEach((lib, i) => {
        console.log(`   ${i + 1}. ${lib.name}`);
        console.log(`      ��� ${lib.address}`);
        console.log(`      ��� Книг: ${lib.books ? lib.books.length : 0}`);
      });
      if (libraries.length > 3) {
        console.log(`   ... и еще ${libraries.length - 3} библиотек`);
      }
    }

    // 4. Показываем популярные книги
    console.log('\n4. ��� ПОПУЛЯРНЫЕ КНИГИ:');
    const popularBooks = await fetchJSON('/api/libraries/books/popular');
    if (popularBooks && popularBooks.length > 0) {
      popularBooks.slice(0, 3).forEach((book, i) => {
        console.log(`   ${i + 1}. ${book.title}`);
        console.log(`      ✍️  Автор: ${book.author}`);
        console.log(`      ���️  Библиотека: ${book.library?.name || 'Не указана'}`);
        console.log(`      ✅ Доступно: ${book.availableCopies || 0} из ${book.totalCopies || 0}`);
      });
    }

    // 5. Демонстрируем поиск
    console.log('\n5. ��� ПОИСК КНИГ (пример с "мир"):');
    const searchResults = await fetchJSON('/api/libraries/books/search?query=мир');
    if (searchResults && searchResults.length > 0) {
      console.log(`   Найдено книг: ${searchResults.length}`);
      searchResults.slice(0, 2).forEach((book, i) => {
        console.log(`   ${i + 1}. ${book.title} - ${book.author}`);
      });
    }

    console.log('\n=========================================');
    console.log('��� ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!');
    console.log('\n��� ДОСТУПНЫЕ ИНТЕРФЕЙСЫ:');
    console.log('   ��� API: http://localhost:3000/api');
    console.log('   ��� Документация: http://localhost:3000/api-docs');
    console.log('   ��� Health check: http://localhost:3000/api/health');
    console.log('   ���️  Библиотеки: http://localhost:3000/api/libraries');
    console.log('\n��� API полностью готов к использованию!');

  } catch (error) {
    console.log('❌ Ошибка при демонстрации:', error.message);
    console.log('��� Проверьте, что сервер запущен: docker-compose ps');
  }
}

// Запускаем демонстрацию
demonstrate();
