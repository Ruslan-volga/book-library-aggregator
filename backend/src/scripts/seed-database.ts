import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Library } from '../modules/libraries/entities/library.entity';
import { Book } from '../modules/libraries/entities/book.entity';

async function bootstrap() {
  console.log('��� Запуск seed скрипта...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Получаем репозитории напрямую
  const libraryRepository = app.get(getRepositoryToken(Library));
  const bookRepository = app.get(getRepositoryToken(Book));

  console.log('��� Добавление тестовых книг...');

  try {
    // Проверяем, есть ли библиотеки
    const libraries = await libraryRepository.find();
    console.log(`Найдено библиотек: ${libraries.length}`);
    
    if (libraries.length === 0) {
      console.log('❌ Нет библиотек для добавления книг!');
      return;
    }

    const library1 = libraries[0]; // Первая библиотека
    const library2 = libraries[1] || libraries[0]; // Вторая или первая

    // Добавляем книги
    const book1 = bookRepository.create({
      title: 'Война и мир',
      author: 'Лев Толстой',
      year: 1869,
      description: 'Роман-эпопея',
      isAvailable: true,
      totalCopies: 3,
      availableCopies: 3,
      library: library1
    });

    const book2 = bookRepository.create({
      title: 'Преступление и наказание',
      author: 'Фёдор Достоевский',
      year: 1866,
      description: 'Психологический роман',
      isAvailable: true,
      totalCopies: 2,
      availableCopies: 2,
      library: library1
    });

    const book3 = bookRepository.create({
      title: 'Мастер и Маргарита',
      author: 'Михаил Булгаков',
      year: 1967,
      description: 'Мистический роман',
      isAvailable: true,
      totalCopies: 4,
      availableCopies: 4,
      library: library2
    });

    await bookRepository.save([book1, book2, book3]);
    console.log('✅ Тестовые книги успешно добавлены!');
    
    // Проверим книги
    const allBooks = await bookRepository.find({
      relations: ['library']
    });
    
    console.log(`��� Всего книг в системе: ${allBooks.length}`);
    
    for (const book of allBooks) {
      console.log(`   ��� "${book.title}" - ${book.author} (Библиотека: ${book.library.name})`);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при добавлении книг:', error.message);
    console.error(error);
  } finally {
    await app.close();
    console.log('��� Seed скрипт завершен');
  }
}

// Проверяем, запущен ли скрипт напрямую
if (require.main === module) {
  bootstrap().catch(error => {
    console.error('❌ Фатальная ошибка:', error);
    process.exit(1);
  });
}
