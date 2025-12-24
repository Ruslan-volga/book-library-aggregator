import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  MANAGER = 'manager'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  @ApiProperty({ example: 'John Doe', description: 'Имя пользователя' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: '+79991234567', description: 'Контактный телефон', required: false })
  contactPhone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT
  })
  @ApiProperty({ 
    example: 'client', 
    description: 'Роль пользователя',
    enum: UserRole,
    default: UserRole.CLIENT
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}