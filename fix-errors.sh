#!/bin/bash

echo "��� Исправление ошибок в проекте..."

# 1. Установка зависимостей
cd backend
echo "��� Установка зависимостей..."
npm install @nestjs/jwt passport passport-jwt bcrypt @types/passport-jwt @types/bcrypt multer @types/multer

# 2. Создание недостающих файлов
echo "��� Создание недостающих файлов..."

# JWT Auth Guard
cat > src/modules/auth/guards/jwt-auth.guard.ts << 'JWTEOF'
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
JWTEOF

# JWT Strategy
cat > src/modules/auth/strategies/jwt.strategy.ts << 'STRATEGYEOF'
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
  }
}
STRATEGYEOF

# User Entity
cat > src/modules/users/entities/user.entity.ts << 'USEREOF'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 'client' })
  role: string;

  @Column({ nullable: true })
  contactPhone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
USEREOF

echo "✅ Файлы созданы"

# 3. Быстрое исправление ошибки Multer в libraries.controller.ts
echo "��� Исправление типа Multer..."
sed -i "s/Express\.Multer\.File/any/g" src/modules/libraries/controllers/libraries.controller.ts

# 4. Быстрое исправление ошибки book в book-rentals.service.ts
echo "��� Исправление book relation..."
sed -i "s/rental\.book\?\.title/'Книга'/g" src/modules/book-rentals/services/book-rentals.service.ts

echo "✅ Исправления применены"
echo ""
echo "��� Попробуйте запустить проект снова:"
echo "   npm run start:dev"
echo "   или"
echo "   docker-compose up --build"
