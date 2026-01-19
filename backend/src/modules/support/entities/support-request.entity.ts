import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  CreateDateColumn,
  UpdateDateColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';

@Entity('support_requests')
export class SupportRequest {
  @PrimaryGeneratedColumn()
  _id: number;

  @ManyToOne(() => User, { eager: true, nullable: false })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.supportRequest, { 
    cascade: true,
    eager: true 
  })
  messages: Message[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  hasNewMessages: boolean;

  // Добавим метод для удобства
  addMessage(message: Message) {
    if (!this.messages) {
      this.messages = [];
    }
    this.messages.push(message);
    this.hasNewMessages = true;
    this.updatedAt = new Date();
  }
}
