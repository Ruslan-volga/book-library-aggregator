import { Controller, Get, Query, BadRequestException, Param } from '@nestjs/common';
import { LibrariesService } from '../services/libraries.service';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Get()
  findAll() {
    return this.librariesService.findAll();
  }

  @Get('books/popular')
  getPopularBooks() {
    return this.librariesService.getPopularBooks();
  }

  @Get('stats/counts')
  getCounts() {
    return this.librariesService.getStatistics();
  }

  @Get('books/search')
  searchBooks(@Query('query') query: string) {
    return this.librariesService.searchBooks(query);
  }

  @Get(':id/books')
  getLibraryBooks(@Param('id') id: string) {
    const libraryId = Number(id);
    if (isNaN(libraryId)) throw new BadRequestException('Неверный ID библиотеки');
    return this.librariesService.findBooksByLibraryId(libraryId);
  }
}
