import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn,
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SupportRequest } from './support-request.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  _id: number;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column('text')
  text: string;

  @CreateDateColumn()
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @ManyToOne(() => SupportRequest, (supportRequest) => supportRequest.messages, { 
    onDelete: 'CASCADE',
    nullable: false 
  })
  @JoinColumn({ name: 'supportRequestId' })
  supportRequest: SupportRequest;

  // Проверка, прочитано ли сообщение
  isRead(): boolean {
    return this.readAt !== null;
  }

  // Отметить как прочитанное
  markAsRead() {
    this.readAt = new Date();
  }
}
