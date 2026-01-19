import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Library } from '../modules/libraries/entities/library.entity';
import { Book } from '../modules/books/entities/book.entity';
import * as bcrypt from 'bcrypt';

async function runSeeds() {
  const dataSource = new DataSource({
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'library_db',
    entities: [User, Library, Book],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Data Source has been initialized!');

  try {
    // Сиды пользователей
    console.log('Запуск сидов...');
    
    const userRepository = dataSource.getRepository(User);
    const libraryRepository = dataSource.getRepository(Library);
    const bookRepository = dataSource.getRepository(Book);

    // Очистка данных (опционально)
    await bookRepository.delete({});
    await libraryRepository.delete({});
    await userRepository.delete({});

    // Создание пользователей
    const users = [
      {
        email: 'admin@library.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Администратор',
        role: 'admin',
      },
      {
        email: 'manager@library.com',
        password: await bcrypt.hash('manager123', 10),
        name: 'Менеджер поддержки',
        role: 'manager',
      },
      {
        email: 'client@library.com',
        password: await bcrypt.hash('client123', 10),
        name: 'Тестовый клиент',
        role: 'client',
      },
    ];

    const savedUsers = await userRepository.save(users);
    console.log(`Создано ${savedUsers.length} пользователей`);

    // Создание библиотек
    const libraries = [
      {
        name: 'Центральная библиотека им. Пушкина',
        address: 'ул. Пушкина, д. 10, Москва',
        description: 'Крупнейшая библиотека города',
      },
      {
        name: 'Научная библиотека',
        address: 'пр. Науки, д. 25, Санкт-Петербург',
        description: 'Специализируется на научной литературе',
      },
      {
        name: 'Детская библиотека',
        address: 'ул. Детская, д. 5, Казань',
        description: 'Библиотека для детей и подростков',
      },
    ];

    const savedLibraries = await libraryRepository.save(libraries);
    console.log(`Создано ${savedLibraries.length} библиотек`);

    // Создание книг
    const books = [
      {
        libraryId: savedLibraries[0].id,
        title: 'Война и мир',
        author: 'Лев Толстой',
        year: 1869,
        description: 'Роман-эпопея о русском обществе эпохи войн против Наполеона',
        isAvailable: true,
        totalCopies: 5,
        availableCopies: 5,
      },
      {
        libraryId: savedLibraries[0].id,
        title: 'Преступление и наказание',
        author: 'Фёдор Достоевский',
        year: 1866,
        description: 'Роман о психологии преступления и моральной ответственности',
        isAvailable: true,
        totalCopies: 3,
        availableCopies: 3,
      },
      {
        libraryId: savedLibraries[1].id,
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        year: 1967,
        description: 'Роман о добре и зле, любви и творчестве',
        isAvailable: true,
        totalCopies: 4,
        availableCopies: 4,
      },
      {
        libraryId: savedLibraries[2].id,
        title: 'Гарри Поттер и философский камень',
        author: 'Дж. К. Роулинг',
        year: 1997,
        description: 'Первая книга серии о юном волшебнике',
        isAvailable: true,
        totalCopies: 10,
        availableCopies: 10,
      },
    ];

    const savedBooks = await bookRepository.save(books);
    console.log(`Создано ${savedBooks.length} книг`);

    console.log('Сиды успешно выполнены!');
  } catch (error) {
    console.error('Ошибка выполнения сидов:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds().catch(console.error);
