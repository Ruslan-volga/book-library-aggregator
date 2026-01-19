import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Library } from '../../libraries/entities/library.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  year: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  totalCopies: number;

  @Column({ default: 0 })
  availableCopies: number;

  @ManyToOne(() => Library, library => library.books)
  @JoinColumn({ name: 'library_id' })
  library: Library;

  @Column({ name: 'library_id' })
  libraryId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
