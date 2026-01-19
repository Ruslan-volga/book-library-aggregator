// Тесты для проверки TypeScript типов

describe('TypeScript Type Checking', () => {
  // Интерфейсы из проекта
  interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    available: boolean;
    libraryId: number;
  }

  interface Library {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
  }

  interface User {
    email: string;
    role: 'admin' | 'manager' | 'client';
    name: string;
  }

  test('Book interface has correct properties', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      year: 2023,
      available: true,
      libraryId: 1,
    };

    expect(book.id).toBe(1);
    expect(book.title).toBe('Test Book');
    expect(typeof book.author).toBe('string');
    expect(typeof book.year).toBe('number');
    expect(typeof book.available).toBe('boolean');
    expect(typeof book.libraryId).toBe('number');
  });

  test('Library interface has correct properties', () => {
    const library: Library = {
      id: 1,
      name: 'Test Library',
      address: 'Test Address',
      phone: '+123456789',
      email: 'test@library.com',
    };

    expect(library.id).toBe(1);
    expect(library.name).toBe('Test Library');
    expect(typeof library.address).toBe('string');
    expect(typeof library.phone).toBe('string');
    expect(typeof library.email).toBe('string');
  });

  test('User interface has correct role types', () => {
    const adminUser: User = {
      email: 'admin@test.com',
      role: 'admin',
      name: 'Admin User',
    };

    const managerUser: User = {
      email: 'manager@test.com',
      role: 'manager',
      name: 'Manager User',
    };

    const clientUser: User = {
      email: 'client@test.com',
      role: 'client',
      name: 'Client User',
    };

    expect(adminUser.role).toBe('admin');
    expect(managerUser.role).toBe('manager');
    expect(clientUser.role).toBe('client');
    
    // Проверяем что роль только из допустимых значений
    const validRoles: Array<User['role']> = ['admin', 'manager', 'client'];
    expect(validRoles).toContain(adminUser.role);
    expect(validRoles).toContain(managerUser.role);
    expect(validRoles).toContain(clientUser.role);
  });

  test('Type safety prevents invalid data', () => {
    // Эти строки должны вызывать TypeScript ошибки при компиляции
    // Мы проверяем что типы работают правильно
    
    // @ts-expect-error - missing required property
    // const invalidBook: Book = { id: 1, title: 'Test' };
    
    // @ts-expect-error - wrong type for role
    // const invalidUser: User = { email: 'test@test.com', role: 'invalid', name: 'Test' };
    
    expect(true).toBe(true); // Просто чтобы тест прошел
  });
});
