import booksReducer from '../../store/slices/booksSlice';

describe('Books Slice - Basic Tests', () => {
  test('initial state contains books data', () => {
    const state = booksReducer(undefined, { type: 'unknown' });
    
    expect(state).toHaveProperty('books');
    expect(state).toHaveProperty('loading', false);
    expect(state).toHaveProperty('error', null);
    
    // Проверяем что есть книги
    expect(state.books.length).toBeGreaterThan(0);
    
    // Проверяем структуру первой книги
    const firstBook = state.books[0];
    expect(firstBook).toHaveProperty('id');
    expect(firstBook).toHaveProperty('title');
    expect(firstBook).toHaveProperty('author');
    expect(firstBook).toHaveProperty('year');
    expect(firstBook).toHaveProperty('available');
    expect(firstBook).toHaveProperty('libraryId');
  });

  test('books have valid data types', () => {
    const state = booksReducer(undefined, { type: 'unknown' });
    
    state.books.forEach(book => {
      expect(typeof book.id).toBe('number');
      expect(typeof book.title).toBe('string');
      expect(typeof book.author).toBe('string');
      expect(typeof book.year).toBe('number');
      expect(typeof book.available).toBe('boolean');
      expect(typeof book.libraryId).toBe('number');
    });
  });

  test('has books with different availability status', () => {
    const state = booksReducer(undefined, { type: 'unknown' });
    
    const availableBooks = state.books.filter(b => b.available);
    const unavailableBooks = state.books.filter(b => !b.available);
    
    expect(availableBooks.length).toBeGreaterThan(0);
    expect(unavailableBooks.length).toBeGreaterThan(0);
  });

  test('books are distributed across libraries', () => {
    const state = booksReducer(undefined, { type: 'unknown' });
    
    const libraryIds = state.books.map(book => book.libraryId);
    const uniqueLibraryIds = [...new Set(libraryIds)];
    
    // Книги должны быть в библиотеках 1, 2 или 3
    uniqueLibraryIds.forEach(id => {
      expect([1, 2, 3]).toContain(id);
    });
  });
});
