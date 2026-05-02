import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCancellingStatusToScriptRun1777494503479 implements MigrationInterface {
    name = 'AddCancellingStatusToScriptRun1777494503479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."script-run_status_enum" RENAME TO "script-run_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."script-run_status_enum" AS ENUM('Queued', 'Running', 'Succeeded', 'Failed', 'Cancelled', 'Cancelling')`);
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "status" TYPE "public"."script-run_status_enum" USING "status"::"text"::"public"."script-run_status_enum"`);
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "status" SET DEFAULT 'Queued'`);
        await queryRunner.query(`DROP TYPE "public"."script-run_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."script-run_status_enum_old" AS ENUM('Queued', 'Running', 'Succeeded', 'Failed', 'Cancelled')`);
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "status" TYPE "public"."script-run_status_enum_old" USING "status"::"text"::"public"."script-run_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "status" SET DEFAULT 'Queued'`);
        await queryRunner.query(`DROP TYPE "public"."script-run_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."script-run_status_enum_old" RENAME TO "script-run_status_enum"`);
    }

}
