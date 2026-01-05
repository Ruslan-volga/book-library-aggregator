import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from '../entities/library.entity';
import { Book } from '../entities/book.entity';
import { CreateLibraryDto } from '../dto/create-library.dto';
import { UpdateLibraryDto } from '../dto/update-library.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(Library) private libraryRepository: Repository<Library>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  // Библиотеки
  async findAll(): Promise<Library[]> {
    return this.libraryRepository.find({ relations: ['books'] });
  }

  async findLibraryById(id: number): Promise<Library> {
    const libraryId = Number(id);
    if (isNaN(libraryId)) throw new BadRequestException('Неверный ID библиотеки');
    
    const library = await this.libraryRepository.findOne({ 
      where: { id: libraryId }, 
      relations: ['books'] 
    });
    
    if (!library) throw new NotFoundException(`Библиотека с ID ${libraryId} не найдена`);
    return library;
  }

  async create(createLibraryDto: CreateLibraryDto): Promise<Library> {
    const library = this.libraryRepository.create(createLibraryDto);
    return this.libraryRepository.save(library);
  }

  async update(id: number, updateLibraryDto: UpdateLibraryDto): Promise<Library> {
    const libraryId = Number(id);
    if (isNaN(libraryId)) throw new BadRequestException('Неверный ID библиотеки');
    
    await this.libraryRepository.update(libraryId, updateLibraryDto);
    return this.findLibraryById(libraryId);
  }

  async remove(id: number): Promise<void> {
    const libraryId = Number(id);
    if (isNaN(libraryId)) throw new BadRequestException('Неверный ID библиотеки');
    
    const result = await this.libraryRepository.delete(libraryId);
    if (result.affected === 0) throw new NotFoundException(`Библиотека с ID ${libraryId} не найдена`);
  }

  // Книги
  async findBooksByLibraryId(libraryId: number): Promise<Book[]> {
    const id = Number(libraryId);
    if (isNaN(id)) throw new BadRequestException('Неверный ID библиотеки');
    
    return this.bookRepository.find({ 
      where: { library: { id } }, 
      relations: ['library'] 
    });
  }

  async findAllBooks(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['library'] });
  }

  async findBookById(id: number): Promise<Book> {
    const bookId = Number(id);
    if (isNaN(bookId)) throw new BadRequestException('Неверный ID книги');
    
    const book = await this.bookRepository.findOne({ 
      where: { id: bookId }, 
      relations: ['library'] 
    });
    
    if (!book) throw new NotFoundException(`Книга с ID ${bookId} не найдена`);
    return book;
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const libraryId = Number(createBookDto.libraryId);
    if (isNaN(libraryId)) throw new BadRequestException('Неверный ID библиотеки');
    
    const library = await this.findLibraryById(libraryId);
    const book = this.bookRepository.create({ ...createBookDto, library });
    return this.bookRepository.save(book);
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const bookId = Number(id);
    if (isNaN(bookId)) throw new BadRequestException('Неверный ID книги');
    
    await this.bookRepository.update(bookId, updateBookDto);
    return this.findBookById(bookId);
  }

  async removeBook(id: number): Promise<void> {
    const bookId = Number(id);
    if (isNaN(bookId)) throw new BadRequestException('Неверный ID книги');
    
    const result = await this.bookRepository.delete(bookId);
    if (result.affected === 0) throw new NotFoundException(`Книга с ID ${bookId} не найдена`);
  }

  // Поиск и фильтрация
  async searchBooks(query: string): Promise<Book[]> {
    if (!query || query.trim() === '') return this.findAllBooks();
    
    return this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.library', 'library')
      .where('book.title ILIKE :query', { query: `%${query}%` })
      .orWhere('book.author ILIKE :query', { query: `%${query}%` })
      .orWhere('book.description ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async getPopularBooks(): Promise<Book[]> {
    return this.bookRepository.find({ 
      relations: ['library'], 
      take: 10, 
      order: { id: 'DESC' } 
    });
  }

  async getNewBooks(): Promise<Book[]> {
    return this.bookRepository.find({ 
      relations: ['library'], 
      take: 10, 
      order: { createdAt: 'DESC' } 
    });
  }

  async getBooksByAuthor(author: string): Promise<Book[]> {
    if (!author || author.trim() === '') throw new BadRequestException('Автор не указан');
    
    return this.bookRepository.find({ 
      where: { author }, 
      relations: ['library'] 
    });
  }

  async getStatistics() {
    const [totalLibraries, totalBooks, availableBooks] = await Promise.all([
      this.libraryRepository.count(),
      this.bookRepository.count(),
      this.bookRepository.count({ where: { isAvailable: true } }),
    ]);
    
    return {
      totalLibraries,
      totalBooks,
      availableBooks,
    };
  }
}
EOFcat > src/modules/libraries/services/libraries.service.ts << 'EOF'
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from '../entities/library.entity';
import { Book } from '../entities/book.entity';
import { CreateLibraryDto } from '../dto/create-library.dto';
import { UpdateLibraryDto } from '../dto/update-library.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(Library) private libraryRepository: Repository<Library>,
    @InjectRepository(Book) private bookRepository: Repository<Book>,
  ) {}

  // Библиотеки
  async findAll(): Promise<Library[]> {
    return this.libraryRepository.find({ relations: ['books'] });
  }

  async findLibraryById(id: number): Promise<Library> {
    const libraryId = Number(id);
    if (isNaN(libraryId)) throw new BadRequestException('Неверный ID библиотеки');
    
    const library = await this.libraryRepository.findOne({ 
      where: { id: libraryId }, 
      relations: ['books'] 
    });
    
    if (!library) throw new NotFoundException(`Библиотека с ID ${libraryId} не найдена`);
    return library;
  }

  async create(createLibraryDto: CreateLibraryDto): Promise<Library> {
    const library = this.libraryRepository.create(createLibraryDto);
    return this.libraryRepository.save(library);
  }

  async update(id: number, updateLibraryDto: UpdateLibraryDto): Promise<Library> {
    const libraryId = Number(id);
    if (isNaN(libraryId)) throw new BadRequestException('Неверный ID библиотеки');
    
    await this.libraryRepository.update(libraryId, updateLibraryDto);
    return this.findLibraryById(libraryId);
  }

  async remove(id: number): Promise<void> {
    const libraryId = Number(id);
    if (isNaN(libraryId)) throw new BadRequestException('Неверный ID библиотеки');
    
    const result = await this.libraryRepository.delete(libraryId);
    if (result.affected === 0) throw new NotFoundException(`Библиотека с ID ${libraryId} не найдена`);
  }

  // Книги
  async findBooksByLibraryId(libraryId: number): Promise<Book[]> {
    const id = Number(libraryId);
    if (isNaN(id)) throw new BadRequestException('Неверный ID библиотеки');
    
    return this.bookRepository.find({ 
      where: { library: { id } }, 
      relations: ['library'] 
    });
  }

  async findAllBooks(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['library'] });
  }

  async findBookById(id: number): Promise<Book> {
    const bookId = Number(id);
    if (isNaN(bookId)) throw new BadRequestException('Неверный ID книги');
    
    const book = await this.bookRepository.findOne({ 
      where: { id: bookId }, 
      relations: ['library'] 
    });
    
    if (!book) throw new NotFoundException(`Книга с ID ${bookId} не найдена`);
    return book;
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const libraryId = Number(createBookDto.libraryId);
    if (isNaN(libraryId)) throw new BadRequestException('Неверный ID библиотеки');
    
    const library = await this.findLibraryById(libraryId);
    const book = this.bookRepository.create({ ...createBookDto, library });
    return this.bookRepository.save(book);
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const bookId = Number(id);
    if (isNaN(bookId)) throw new BadRequestException('Неверный ID книги');
    
    await this.bookRepository.update(bookId, updateBookDto);
    return this.findBookById(bookId);
  }

  async removeBook(id: number): Promise<void> {
    const bookId = Number(id);
    if (isNaN(bookId)) throw new BadRequestException('Неверный ID книги');
    
    const result = await this.bookRepository.delete(bookId);
    if (result.affected === 0) throw new NotFoundException(`Книга с ID ${bookId} не найдена`);
  }

  // Поиск и фильтрация
  async searchBooks(query: string): Promise<Book[]> {
    if (!query || query.trim() === '') return this.findAllBooks();
    
    return this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.library', 'library')
      .where('book.title ILIKE :query', { query: `%${query}%` })
      .orWhere('book.author ILIKE :query', { query: `%${query}%` })
      .orWhere('book.description ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async getPopularBooks(): Promise<Book[]> {
    return this.bookRepository.find({ 
      relations: ['library'], 
      take: 10, 
      order: { id: 'DESC' } 
    });
  }

  async getNewBooks(): Promise<Book[]> {
    return this.bookRepository.find({ 
      relations: ['library'], 
      take: 10, 
      order: { createdAt: 'DESC' } 
    });
  }

  async getBooksByAuthor(author: string): Promise<Book[]> {
    if (!author || author.trim() === '') throw new BadRequestException('Автор не указан');
    
    return this.bookRepository.find({ 
      where: { author }, 
      relations: ['library'] 
    });
  }

  async getStatistics() {
    const [totalLibraries, totalBooks, availableBooks] = await Promise.all([
      this.libraryRepository.count(),
      this.bookRepository.count(),
      this.bookRepository.count({ where: { isAvailable: true } }),
    ]);
    
    return {
      totalLibraries,
      totalBooks,
      availableBooks,
    };
  }
}
