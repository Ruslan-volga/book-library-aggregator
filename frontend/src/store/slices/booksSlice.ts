import { createSlice } from '@reduxjs/toolkit';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  available: boolean;
  libraryId?: number; // Добавляем связь с библиотекой
}

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [
    { id: 1, title: 'Война и мир', author: 'Лев Толстой', year: 1869, available: true, libraryId: 1 },
    { id: 2, title: 'Преступление и наказание', author: 'Фёдор Достоевский', year: 1866, available: true, libraryId: 1 },
    { id: 3, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', year: 1967, available: false, libraryId: 1 },
    { id: 4, title: '1984', author: 'Джордж Оруэлл', year: 1949, available: true, libraryId: 2 },
    { id: 5, title: 'Улисс', author: 'Джеймс Джойс', year: 1922, available: false, libraryId: 2 },
    { id: 6, title: 'Гарри Поттер и философский камень', author: 'Дж. К. Роулинг', year: 1997, available: true, libraryId: 3 },
    { id: 7, title: 'Властелин колец', author: 'Дж. Р. Р. Толкин', year: 1954, available: true, libraryId: 3 },
    { id: 8, title: 'Анна Каренина', author: 'Лев Толстой', year: 1877, available: true, libraryId: 2 },
    { id: 9, title: 'Мёртвые души', author: 'Николай Гоголь', year: 1842, available: true, libraryId: 1 },
    { id: 10, title: 'Отцы и дети', author: 'Иван Тургенев', year: 1862, available: false, libraryId: 3 },
  ],
  loading: false,
  error: null,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
});

export default booksSlice.reducer;
