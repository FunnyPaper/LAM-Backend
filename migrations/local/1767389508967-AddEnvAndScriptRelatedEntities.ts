import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnvAndScriptRelatedEntities1767389508967 implements MigrationInterface {
    name = 'AddEnvAndScriptRelatedEntities1767389508967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "script-content" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "astJson" text, "astVersion" integer NOT NULL, "engineVersion" integer NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "script-source" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "format" varchar CHECK( "format" IN ('json') ) NOT NULL, "content" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "env" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" varchar, "data" text, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "ownerId" varchar)`);
        await queryRunner.query(`CREATE TABLE "script-run-result" ("scriptRunId" varchar PRIMARY KEY NOT NULL, "data" text, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "script-run" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( "status" IN ('Queued','Running','Succeeded','Failed','Cancelled') ) NOT NULL DEFAULT ('Queued'), "scriptVersionSnapshot" text NOT NULL, "envSnapshot" text NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "finishedAt" text NOT NULL, "scriptVersionId" varchar, "envId" varchar)`);
        await queryRunner.query(`CREATE TABLE "script-version" ("id" varchar PRIMARY KEY NOT NULL, "versionNumber" integer NOT NULL, "status" varchar CHECK( "status" IN ('Draft','Published','Archived') ) NOT NULL DEFAULT ('Draft'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "scriptId" varchar)`);
        await queryRunner.query(`CREATE TABLE "script" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" varchar, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "ownerId" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_script-content" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "astJson" text, "astVersion" integer NOT NULL, "engineVersion" integer NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_efbd3988b9e2f8b5995b9336d45" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-content"("scriptVersionId", "astJson", "astVersion", "engineVersion", "createdAt", "updatedAt") SELECT "scriptVersionId", "astJson", "astVersion", "engineVersion", "createdAt", "updatedAt" FROM "script-content"`);
        await queryRunner.query(`DROP TABLE "script-content"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-content" RENAME TO "script-content"`);
        await queryRunner.query(`CREATE TABLE "temporary_script-source" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "format" varchar CHECK( "format" IN ('json') ) NOT NULL, "content" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_367832dfb8f0f473adfdc007381" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-source"("scriptVersionId", "format", "content", "createdAt", "updatedAt") SELECT "scriptVersionId", "format", "content", "createdAt", "updatedAt" FROM "script-source"`);
        await queryRunner.query(`DROP TABLE "script-source"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-source" RENAME TO "script-source"`);
        await queryRunner.query(`CREATE TABLE "temporary_env" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" varchar, "data" text, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "ownerId" varchar, CONSTRAINT "FK_17c4bcc0fe4017df9f543f4c64f" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_env"("id", "name", "description", "data", "createdAt", "updatedAt", "ownerId") SELECT "id", "name", "description", "data", "createdAt", "updatedAt", "ownerId" FROM "env"`);
        await queryRunner.query(`DROP TABLE "env"`);
        await queryRunner.query(`ALTER TABLE "temporary_env" RENAME TO "env"`);
        await queryRunner.query(`CREATE TABLE "temporary_script-run-result" ("scriptRunId" varchar PRIMARY KEY NOT NULL, "data" text, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_5cb662ceb49defe54788681b1e2" FOREIGN KEY ("scriptRunId") REFERENCES "script-run" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-run-result"("scriptRunId", "data", "createdAt", "updatedAt") SELECT "scriptRunId", "data", "createdAt", "updatedAt" FROM "script-run-result"`);
        await queryRunner.query(`DROP TABLE "script-run-result"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-run-result" RENAME TO "script-run-result"`);
        await queryRunner.query(`CREATE TABLE "temporary_script-run" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( "status" IN ('Queued','Running','Succeeded','Failed','Cancelled') ) NOT NULL DEFAULT ('Queued'), "scriptVersionSnapshot" text NOT NULL, "envSnapshot" text NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "finishedAt" text NOT NULL, "scriptVersionId" varchar, "envId" varchar, CONSTRAINT "FK_58640f153e7c1fbabdb0e0cef31" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_dc8e220962484612363f774b8e6" FOREIGN KEY ("envId") REFERENCES "env" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-run"("id", "status", "scriptVersionSnapshot", "envSnapshot", "createdAt", "updatedAt", "finishedAt", "scriptVersionId", "envId") SELECT "id", "status", "scriptVersionSnapshot", "envSnapshot", "createdAt", "updatedAt", "finishedAt", "scriptVersionId", "envId" FROM "script-run"`);
        await queryRunner.query(`DROP TABLE "script-run"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-run" RENAME TO "script-run"`);
        await queryRunner.query(`CREATE TABLE "temporary_script-version" ("id" varchar PRIMARY KEY NOT NULL, "versionNumber" integer NOT NULL, "status" varchar CHECK( "status" IN ('Draft','Published','Archived') ) NOT NULL DEFAULT ('Draft'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "scriptId" varchar, CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba" FOREIGN KEY ("scriptId") REFERENCES "script" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-version"("id", "versionNumber", "status", "createdAt", "scriptId") SELECT "id", "versionNumber", "status", "createdAt", "scriptId" FROM "script-version"`);
        await queryRunner.query(`DROP TABLE "script-version"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-version" RENAME TO "script-version"`);
        await queryRunner.query(`CREATE TABLE "temporary_script" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" varchar, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "ownerId" varchar, CONSTRAINT "FK_2b0cd0f537cb8816d4914754983" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script"("id", "name", "description", "createdAt", "updatedAt", "ownerId") SELECT "id", "name", "description", "createdAt", "updatedAt", "ownerId" FROM "script"`);
        await queryRunner.query(`DROP TABLE "script"`);
        await queryRunner.query(`ALTER TABLE "temporary_script" RENAME TO "script"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script" RENAME TO "temporary_script"`);
        await queryRunner.query(`CREATE TABLE "script" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" varchar, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "ownerId" varchar)`);
        await queryRunner.query(`INSERT INTO "script"("id", "name", "description", "createdAt", "updatedAt", "ownerId") SELECT "id", "name", "description", "createdAt", "updatedAt", "ownerId" FROM "temporary_script"`);
        await queryRunner.query(`DROP TABLE "temporary_script"`);
        await queryRunner.query(`ALTER TABLE "script-version" RENAME TO "temporary_script-version"`);
        await queryRunner.query(`CREATE TABLE "script-version" ("id" varchar PRIMARY KEY NOT NULL, "versionNumber" integer NOT NULL, "status" varchar CHECK( "status" IN ('Draft','Published','Archived') ) NOT NULL DEFAULT ('Draft'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "scriptId" varchar)`);
        await queryRunner.query(`INSERT INTO "script-version"("id", "versionNumber", "status", "createdAt", "scriptId") SELECT "id", "versionNumber", "status", "createdAt", "scriptId" FROM "temporary_script-version"`);
        await queryRunner.query(`DROP TABLE "temporary_script-version"`);
        await queryRunner.query(`ALTER TABLE "script-run" RENAME TO "temporary_script-run"`);
        await queryRunner.query(`CREATE TABLE "script-run" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( "status" IN ('Queued','Running','Succeeded','Failed','Cancelled') ) NOT NULL DEFAULT ('Queued'), "scriptVersionSnapshot" text NOT NULL, "envSnapshot" text NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "finishedAt" text NOT NULL, "scriptVersionId" varchar, "envId" varchar)`);
        await queryRunner.query(`INSERT INTO "script-run"("id", "status", "scriptVersionSnapshot", "envSnapshot", "createdAt", "updatedAt", "finishedAt", "scriptVersionId", "envId") SELECT "id", "status", "scriptVersionSnapshot", "envSnapshot", "createdAt", "updatedAt", "finishedAt", "scriptVersionId", "envId" FROM "temporary_script-run"`);
        await queryRunner.query(`DROP TABLE "temporary_script-run"`);
        await queryRunner.query(`ALTER TABLE "script-run-result" RENAME TO "temporary_script-run-result"`);
        await queryRunner.query(`CREATE TABLE "script-run-result" ("scriptRunId" varchar PRIMARY KEY NOT NULL, "data" text, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "script-run-result"("scriptRunId", "data", "createdAt", "updatedAt") SELECT "scriptRunId", "data", "createdAt", "updatedAt" FROM "temporary_script-run-result"`);
        await queryRunner.query(`DROP TABLE "temporary_script-run-result"`);
        await queryRunner.query(`ALTER TABLE "env" RENAME TO "temporary_env"`);
        await queryRunner.query(`CREATE TABLE "env" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "description" varchar, "data" text, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "ownerId" varchar)`);
        await queryRunner.query(`INSERT INTO "env"("id", "name", "description", "data", "createdAt", "updatedAt", "ownerId") SELECT "id", "name", "description", "data", "createdAt", "updatedAt", "ownerId" FROM "temporary_env"`);
        await queryRunner.query(`DROP TABLE "temporary_env"`);
        await queryRunner.query(`ALTER TABLE "script-source" RENAME TO "temporary_script-source"`);
        await queryRunner.query(`CREATE TABLE "script-source" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "format" varchar CHECK( "format" IN ('json') ) NOT NULL, "content" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "script-source"("scriptVersionId", "format", "content", "createdAt", "updatedAt") SELECT "scriptVersionId", "format", "content", "createdAt", "updatedAt" FROM "temporary_script-source"`);
        await queryRunner.query(`DROP TABLE "temporary_script-source"`);
        await queryRunner.query(`ALTER TABLE "script-content" RENAME TO "temporary_script-content"`);
        await queryRunner.query(`CREATE TABLE "script-content" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "astJson" text, "astVersion" integer NOT NULL, "engineVersion" integer NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "script-content"("scriptVersionId", "astJson", "astVersion", "engineVersion", "createdAt", "updatedAt") SELECT "scriptVersionId", "astJson", "astVersion", "engineVersion", "createdAt", "updatedAt" FROM "temporary_script-content"`);
        await queryRunner.query(`DROP TABLE "temporary_script-content"`);
        await queryRunner.query(`DROP TABLE "script"`);
        await queryRunner.query(`DROP TABLE "script-version"`);
        await queryRunner.query(`DROP TABLE "script-run"`);
        await queryRunner.query(`DROP TABLE "script-run-result"`);
        await queryRunner.query(`DROP TABLE "env"`);
        await queryRunner.query(`DROP TABLE "script-source"`);
        await queryRunner.query(`DROP TABLE "script-content"`);
    }

}
