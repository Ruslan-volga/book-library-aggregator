import booksReducer from '../booksSlice';

describe('booksSlice', () => {
  it('should return initial state with books', () => {
    const initialState = booksReducer(undefined, { type: '' });
    
    expect(initialState.books).toHaveLength(10); // У нас 10 книг в фикстурах
    expect(initialState.books[0]).toHaveProperty('title', 'Война и мир');
    expect(initialState.books[0]).toHaveProperty('author', 'Лев Толстой');
    expect(initialState.books[0]).toHaveProperty('available', true);
    expect(initialState.books[0]).toHaveProperty('libraryId', 1);
    
    expect(initialState.loading).toBe(false);
    expect(initialState.error).toBeNull();
  });

  it('should have correct book structure', () => {
    const initialState = booksReducer(undefined, { type: '' });
    
    initialState.books.forEach(book => {
      expect(book).toHaveProperty('id');
      expect(typeof book.id).toBe('number');
      
      expect(book).toHaveProperty('title');
      expect(typeof book.title).toBe('string');
      
      expect(book).toHaveProperty('author');
      expect(typeof book.author).toBe('string');
      
      expect(book).toHaveProperty('year');
      expect(typeof book.year).toBe('number');
      
      expect(book).toHaveProperty('available');
      expect(typeof book.available).toBe('boolean');
      
      expect(book).toHaveProperty('libraryId');
      expect(typeof book.libraryId).toBe('number');
    });
  });

  it('should have books distributed across libraries', () => {
    const initialState = booksReducer(undefined, { type: '' });
    
    const libraryIds = initialState.books.map(book => book.libraryId);
    const uniqueLibraryIds = [...new Set(libraryIds)];
    
    // Проверяем что книги распределены по библиотекам 1, 2, 3
    expect(uniqueLibraryIds.sort()).toEqual([1, 2, 3]);
    
    // Подсчитываем книги в каждой библиотеке
    const booksInLibrary1 = initialState.books.filter(book => book.libraryId === 1);
    const booksInLibrary2 = initialState.books.filter(book => book.libraryId === 2);
    const booksInLibrary3 = initialState.books.filter(book => book.libraryId === 3);
    
    expect(booksInLibrary1.length).toBeGreaterThan(0);
    expect(booksInLibrary2.length).toBeGreaterThan(0);
    expect(booksInLibrary3.length).toBeGreaterThan(0);
  });

  it('should have mixed availability status', () => {
    const initialState = booksReducer(undefined, { type: '' });
    
    const availableBooks = initialState.books.filter(book => book.available);
    const unavailableBooks = initialState.books.filter(book => !book.available);
    
    expect(availableBooks.length).toBeGreaterThan(0);
    expect(unavailableBooks.length).toBeGreaterThan(0);
  });
});
