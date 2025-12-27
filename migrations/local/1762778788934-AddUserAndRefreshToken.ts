import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAndRefreshToken1762778788934 implements MigrationInterface {
    name = 'AddUserAndRefreshToken1762778788934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh-token" ("id" varchar PRIMARY KEY NOT NULL, "tokenHash" varchar NOT NULL, "expiresAt" text NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "role" text NOT NULL DEFAULT ('USER'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "refreshTokenId" varchar, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "REL_7c91492fa6749e6d222216fa87" UNIQUE ("refreshTokenId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "role" text NOT NULL DEFAULT ('USER'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "refreshTokenId" varchar, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "REL_7c91492fa6749e6d222216fa87" UNIQUE ("refreshTokenId"), CONSTRAINT "FK_7c91492fa6749e6d222216fa874" FOREIGN KEY ("refreshTokenId") REFERENCES "refresh-token" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "username", "password", "role", "createdAt", "updatedAt", "refreshTokenId") SELECT "id", "username", "password", "role", "createdAt", "updatedAt", "refreshTokenId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "role" text NOT NULL DEFAULT ('USER'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "refreshTokenId" varchar, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "REL_7c91492fa6749e6d222216fa87" UNIQUE ("refreshTokenId"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "username", "password", "role", "createdAt", "updatedAt", "refreshTokenId") SELECT "id", "username", "password", "role", "createdAt", "updatedAt", "refreshTokenId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "refresh-token"`);
    }

}
