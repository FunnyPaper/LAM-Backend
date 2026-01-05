import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingEnvSnapshotConstraint1767727498081 implements MigrationInterface {
    name = 'AddMissingEnvSnapshotConstraint1767727498081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_script-source" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "format" varchar CHECK( "format" IN ('json') ) NOT NULL, "content" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_367832dfb8f0f473adfdc007381" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-source"("scriptVersionId", "format", "content", "createdAt", "updatedAt") SELECT "scriptVersionId", "format", "content", "createdAt", "updatedAt" FROM "script-source"`);
        await queryRunner.query(`DROP TABLE "script-source"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-source" RENAME TO "script-source"`);
        await queryRunner.query(`CREATE TABLE "temporary_script-version" ("id" varchar PRIMARY KEY NOT NULL, "versionNumber" integer NOT NULL, "status" varchar CHECK( "status" IN ('Draft','Published','Archived') ) NOT NULL DEFAULT ('Draft'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "scriptId" varchar, CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba" FOREIGN KEY ("scriptId") REFERENCES "script" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-version"("id", "versionNumber", "status", "createdAt", "scriptId") SELECT "id", "versionNumber", "status", "createdAt", "scriptId" FROM "script-version"`);
        await queryRunner.query(`DROP TABLE "script-version"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-version" RENAME TO "script-version"`);
        await queryRunner.query(`CREATE TABLE "temporary_script-source" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "format" varchar CHECK( "format" IN ('json') ) NOT NULL, "content" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_367832dfb8f0f473adfdc007381" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-source"("scriptVersionId", "format", "content", "createdAt", "updatedAt") SELECT "scriptVersionId", "format", "content", "createdAt", "updatedAt" FROM "script-source"`);
        await queryRunner.query(`DROP TABLE "script-source"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-source" RENAME TO "script-source"`);
        await queryRunner.query(`CREATE TABLE "temporary_script-run" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( "status" IN ('Queued','Running','Succeeded','Failed','Cancelled') ) NOT NULL DEFAULT ('Queued'), "scriptVersionSnapshot" text NOT NULL, "envSnapshot" text, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "finishedAt" text, "scriptVersionId" varchar, "envId" varchar, "createdById" varchar, CONSTRAINT "FK_dc8e220962484612363f774b8e6" FOREIGN KEY ("envId") REFERENCES "env" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_58640f153e7c1fbabdb0e0cef31" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_c3e8f3853523d93284a620f0237" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-run"("id", "status", "scriptVersionSnapshot", "envSnapshot", "createdAt", "updatedAt", "finishedAt", "scriptVersionId", "envId", "createdById") SELECT "id", "status", "scriptVersionSnapshot", "envSnapshot", "createdAt", "updatedAt", "finishedAt", "scriptVersionId", "envId", "createdById" FROM "script-run"`);
        await queryRunner.query(`DROP TABLE "script-run"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-run" RENAME TO "script-run"`);
        await queryRunner.query(`CREATE TABLE "temporary_script-version" ("id" varchar PRIMARY KEY NOT NULL, "versionNumber" integer NOT NULL, "status" varchar CHECK( "status" IN ('Draft','Published','Archived') ) NOT NULL DEFAULT ('Draft'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "scriptId" varchar, CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba" FOREIGN KEY ("scriptId") REFERENCES "script" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_script-version"("id", "versionNumber", "status", "createdAt", "scriptId") SELECT "id", "versionNumber", "status", "createdAt", "scriptId" FROM "script-version"`);
        await queryRunner.query(`DROP TABLE "script-version"`);
        await queryRunner.query(`ALTER TABLE "temporary_script-version" RENAME TO "script-version"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script-version" RENAME TO "temporary_script-version"`);
        await queryRunner.query(`CREATE TABLE "script-version" ("id" varchar PRIMARY KEY NOT NULL, "versionNumber" integer NOT NULL, "status" varchar CHECK( "status" IN ('Draft','Published','Archived') ) NOT NULL DEFAULT ('Draft'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "scriptId" varchar, CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba" FOREIGN KEY ("scriptId") REFERENCES "script" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "script-version"("id", "versionNumber", "status", "createdAt", "scriptId") SELECT "id", "versionNumber", "status", "createdAt", "scriptId" FROM "temporary_script-version"`);
        await queryRunner.query(`DROP TABLE "temporary_script-version"`);
        await queryRunner.query(`ALTER TABLE "script-run" RENAME TO "temporary_script-run"`);
        await queryRunner.query(`CREATE TABLE "script-run" ("id" varchar PRIMARY KEY NOT NULL, "status" varchar CHECK( "status" IN ('Queued','Running','Succeeded','Failed','Cancelled') ) NOT NULL DEFAULT ('Queued'), "scriptVersionSnapshot" text NOT NULL, "envSnapshot" text NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), "finishedAt" text, "scriptVersionId" varchar, "envId" varchar, "createdById" varchar, CONSTRAINT "FK_dc8e220962484612363f774b8e6" FOREIGN KEY ("envId") REFERENCES "env" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_58640f153e7c1fbabdb0e0cef31" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_c3e8f3853523d93284a620f0237" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "script-run"("id", "status", "scriptVersionSnapshot", "envSnapshot", "createdAt", "updatedAt", "finishedAt", "scriptVersionId", "envId", "createdById") SELECT "id", "status", "scriptVersionSnapshot", "envSnapshot", "createdAt", "updatedAt", "finishedAt", "scriptVersionId", "envId", "createdById" FROM "temporary_script-run"`);
        await queryRunner.query(`DROP TABLE "temporary_script-run"`);
        await queryRunner.query(`ALTER TABLE "script-source" RENAME TO "temporary_script-source"`);
        await queryRunner.query(`CREATE TABLE "script-source" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "format" varchar CHECK( "format" IN ('json') ) NOT NULL, "content" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_367832dfb8f0f473adfdc007381" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "script-source"("scriptVersionId", "format", "content", "createdAt", "updatedAt") SELECT "scriptVersionId", "format", "content", "createdAt", "updatedAt" FROM "temporary_script-source"`);
        await queryRunner.query(`DROP TABLE "temporary_script-source"`);
        await queryRunner.query(`ALTER TABLE "script-version" RENAME TO "temporary_script-version"`);
        await queryRunner.query(`CREATE TABLE "script-version" ("id" varchar PRIMARY KEY NOT NULL, "versionNumber" integer NOT NULL, "status" varchar CHECK( "status" IN ('Draft','Published','Archived') ) NOT NULL DEFAULT ('Draft'), "createdAt" text NOT NULL DEFAULT (datetime('now')), "scriptId" varchar, CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba" FOREIGN KEY ("scriptId") REFERENCES "script" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "script-version"("id", "versionNumber", "status", "createdAt", "scriptId") SELECT "id", "versionNumber", "status", "createdAt", "scriptId" FROM "temporary_script-version"`);
        await queryRunner.query(`DROP TABLE "temporary_script-version"`);
        await queryRunner.query(`ALTER TABLE "script-source" RENAME TO "temporary_script-source"`);
        await queryRunner.query(`CREATE TABLE "script-source" ("scriptVersionId" varchar PRIMARY KEY NOT NULL, "format" varchar CHECK( "format" IN ('json') ) NOT NULL, "content" varchar NOT NULL, "createdAt" text NOT NULL DEFAULT (datetime('now')), "updatedAt" text NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_367832dfb8f0f473adfdc007381" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "script-source"("scriptVersionId", "format", "content", "createdAt", "updatedAt") SELECT "scriptVersionId", "format", "content", "createdAt", "updatedAt" FROM "temporary_script-source"`);
        await queryRunner.query(`DROP TABLE "temporary_script-source"`);
    }

}
