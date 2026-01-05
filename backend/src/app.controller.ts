import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('api/health')
  health() {
    return { status: 'ok', timestamp: new Date() };
  }

  @Get('api/libraries')
  getLibraries() {
    return [
      { id: 1, name: 'Центральная библиотека', address: 'ул. Центральная, 1' },
      { id: 2, name: 'Городская библиотека', address: 'пр. Ленина, 10' },
    ];
  }

  @Get('api/libraries/books/popular')
  getPopularBooks() {
    return [
      { id: 1, title: 'Книга 1', author: 'Автор 1', available: true },
      { id: 2, title: 'Книга 2', author: 'Автор 2', available: true },
    ];
  }

  @Get('api/libraries/stats/counts')
  getStats() {
    return { libraries: 2, books: 100, availableBooks: 85 };
  }
}
