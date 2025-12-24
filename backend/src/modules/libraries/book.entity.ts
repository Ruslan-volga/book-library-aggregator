import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Library } from './library.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  libraryId: number;

  @ManyToOne(() => Library)
  @JoinColumn({ name: 'libraryId' })
  library: Library;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  year: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 1 })
  totalCopies: number;

  @Column({ default: 1 })
  availableCopies: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}