import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameAndUpdatedAtToScriptVersion1776891548720 implements MigrationInterface {
    name = 'AddNameAndUpdatedAtToScriptVersion1776891548720'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script-version" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "script-version" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script-version" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "script-version" DROP COLUMN "name"`);
    }

}
