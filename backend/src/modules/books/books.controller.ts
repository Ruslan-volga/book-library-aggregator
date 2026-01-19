import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string): Promise<Book[]> {
    return this.booksService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(+id);
  }

  @Post()
  create(@Body() bookData: Partial<Book>): Promise<Book> {
    return this.booksService.create(bookData);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() bookData: Partial<Book>): Promise<Book> {
    return this.booksService.update(+id, bookData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.booksService.remove(+id);
  }
}
