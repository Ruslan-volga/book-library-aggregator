import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { SupportModule } from './modules/support/support.module';
@Module({
  imports: [SupportModule],
  controllers: [BooksController],
  providers: [],
})
export class AppModule {}
