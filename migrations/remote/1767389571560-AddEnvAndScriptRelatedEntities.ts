import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnvAndScriptRelatedEntities1767389571560 implements MigrationInterface {
    name = 'AddEnvAndScriptRelatedEntities1767389571560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "script-content" ("scriptVersionId" uuid NOT NULL, "astJson" jsonb, "astVersion" integer NOT NULL, "engineVersion" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_efbd3988b9e2f8b5995b9336d45" PRIMARY KEY ("scriptVersionId"))`);
        await queryRunner.query(`CREATE TYPE "public"."script-source_format_enum" AS ENUM('json')`);
        await queryRunner.query(`CREATE TABLE "script-source" ("scriptVersionId" uuid NOT NULL, "format" "public"."script-source_format_enum" NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_367832dfb8f0f473adfdc007381" PRIMARY KEY ("scriptVersionId"))`);
        await queryRunner.query(`CREATE TABLE "env" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "data" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_3afda6f649f449e9f94b509aaff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "script-run-result" ("scriptRunId" uuid NOT NULL, "data" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5cb662ceb49defe54788681b1e2" PRIMARY KEY ("scriptRunId"))`);
        await queryRunner.query(`CREATE TYPE "public"."script-run_status_enum" AS ENUM('Queued', 'Running', 'Succeeded', 'Failed', 'Cancelled')`);
        await queryRunner.query(`CREATE TABLE "script-run" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."script-run_status_enum" NOT NULL DEFAULT 'Queued', "scriptVersionSnapshot" jsonb NOT NULL, "envSnapshot" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "finishedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "scriptVersionId" uuid, "envId" uuid, CONSTRAINT "PK_8a81e41b460aaddf53ea74939aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."script-version_status_enum" AS ENUM('Draft', 'Published', 'Archived')`);
        await queryRunner.query(`CREATE TABLE "script-version" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "versionNumber" integer NOT NULL, "status" "public"."script-version_status_enum" NOT NULL DEFAULT 'Draft', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "scriptId" uuid, CONSTRAINT "PK_b1628f50573410bd7ca9dbf7611" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "script" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_90683f80965555e177a0e7346af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "script-content" ADD CONSTRAINT "FK_efbd3988b9e2f8b5995b9336d45" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script-source" ADD CONSTRAINT "FK_367832dfb8f0f473adfdc007381" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "env" ADD CONSTRAINT "FK_17c4bcc0fe4017df9f543f4c64f" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script-run-result" ADD CONSTRAINT "FK_5cb662ceb49defe54788681b1e2" FOREIGN KEY ("scriptRunId") REFERENCES "script-run"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script-run" ADD CONSTRAINT "FK_58640f153e7c1fbabdb0e0cef31" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script-run" ADD CONSTRAINT "FK_dc8e220962484612363f774b8e6" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script-version" ADD CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba" FOREIGN KEY ("scriptId") REFERENCES "script"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script" ADD CONSTRAINT "FK_2b0cd0f537cb8816d4914754983" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script" DROP CONSTRAINT "FK_2b0cd0f537cb8816d4914754983"`);
        await queryRunner.query(`ALTER TABLE "script-version" DROP CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba"`);
        await queryRunner.query(`ALTER TABLE "script-run" DROP CONSTRAINT "FK_dc8e220962484612363f774b8e6"`);
        await queryRunner.query(`ALTER TABLE "script-run" DROP CONSTRAINT "FK_58640f153e7c1fbabdb0e0cef31"`);
        await queryRunner.query(`ALTER TABLE "script-run-result" DROP CONSTRAINT "FK_5cb662ceb49defe54788681b1e2"`);
        await queryRunner.query(`ALTER TABLE "env" DROP CONSTRAINT "FK_17c4bcc0fe4017df9f543f4c64f"`);
        await queryRunner.query(`ALTER TABLE "script-source" DROP CONSTRAINT "FK_367832dfb8f0f473adfdc007381"`);
        await queryRunner.query(`ALTER TABLE "script-content" DROP CONSTRAINT "FK_efbd3988b9e2f8b5995b9336d45"`);
        await queryRunner.query(`DROP TABLE "script"`);
        await queryRunner.query(`DROP TABLE "script-version"`);
        await queryRunner.query(`DROP TYPE "public"."script-version_status_enum"`);
        await queryRunner.query(`DROP TABLE "script-run"`);
        await queryRunner.query(`DROP TYPE "public"."script-run_status_enum"`);
        await queryRunner.query(`DROP TABLE "script-run-result"`);
        await queryRunner.query(`DROP TABLE "env"`);
        await queryRunner.query(`DROP TABLE "script-source"`);
        await queryRunner.query(`DROP TYPE "public"."script-source_format_enum"`);
        await queryRunner.query(`DROP TABLE "script-content"`);
    }

}
