import { Controller, Get, Query } from '@nestjs/common';

interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  description?: string;
  library?: {
    id: number;
    name: string;
  };
  totalCopies?: number;
  availableCopies?: number;
}

@Controller('books')
export class BooksController {
  private books: Book[] = [
    {
      id: 1,
      title: 'Война и мир',
      author: 'Лев Толстой',
      year: 1869,
      description: 'Роман-эпопея о русском обществе',
      library: { id: 1, name: 'Центральная библиотека им. Пушкина' },
      totalCopies: 5,
      availableCopies: 5,
    },
    {
      id: 2,
      title: 'Преступление и наказание',
      author: 'Фёдор Достоевский',
      year: 1866,
      description: 'Роман о психологии преступления',
      library: { id: 1, name: 'Центральная библиотека им. Пушкина' },
      totalCopies: 3,
      availableCopies: 3,
    },
  ];

  @Get()
  getAllBooks(): Book[] {
    return this.books;
  }

  @Get('search')
  searchBooks(@Query('q') query: string): Book[] {
    if (!query) return this.books;
    const q = query.toLowerCase();
    return this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q),
    );
  }
}
