import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSupportTables1705610000000 implements MigrationInterface {
  name = 'CreateSupportTables1705610000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создаем таблицу support_requests
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS support_requests (
        _id SERIAL PRIMARY KEY,
        "userId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" boolean NOT NULL DEFAULT true,
        "hasNewMessages" boolean NOT NULL DEFAULT false
      )
    `);

    // Создаем таблицу messages
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS messages (
        _id SERIAL PRIMARY KEY,
        "authorId" integer NOT NULL,
        "text" text NOT NULL,
        "sentAt" TIMESTAMP NOT NULL DEFAULT now(),
        "readAt" TIMESTAMP,
        "supportRequestId" integer NOT NULL
      )
    `);

    // Добавляем foreign keys
    await queryRunner.query(`
      ALTER TABLE support_requests 
      ADD CONSTRAINT "FK_support_requests_user" 
      FOREIGN KEY ("userId") 
      REFERENCES users(_id) 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE messages 
      ADD CONSTRAINT "FK_messages_author" 
      FOREIGN KEY ("authorId") 
      REFERENCES users(_id) 
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE messages 
      ADD CONSTRAINT "FK_messages_support_request" 
      FOREIGN KEY ("supportRequestId") 
      REFERENCES support_requests(_id) 
      ON DELETE CASCADE
    `);

    // Добавляем индексы для производительности
    await queryRunner.query(`
      CREATE INDEX "IDX_support_requests_user" ON support_requests("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_support_requests_is_active" ON support_requests("isActive")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_messages_support_request" ON messages("supportRequestId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_messages_read_at" ON messages("readAt")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_messages_sent_at" ON messages("sentAt")
    `);

    console.log('Таблицы поддержки успешно созданы');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем foreign keys
    await queryRunner.query(`
      ALTER TABLE messages 
      DROP CONSTRAINT IF EXISTS "FK_messages_support_request"
    `);

    await queryRunner.query(`
      ALTER TABLE messages 
      DROP CONSTRAINT IF EXISTS "FK_messages_author"
    `);

    await queryRunner.query(`
      ALTER TABLE support_requests 
      DROP CONSTRAINT IF EXISTS "FK_support_requests_user"
    `);

    // Удаляем индексы
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_messages_sent_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_messages_read_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_messages_support_request"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_support_requests_is_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_support_requests_user"`);

    // Удаляем таблицы
    await queryRunner.query(`DROP TABLE IF EXISTS messages`);
    await queryRunner.query(`DROP TABLE IF EXISTS support_requests`);
  }
}
