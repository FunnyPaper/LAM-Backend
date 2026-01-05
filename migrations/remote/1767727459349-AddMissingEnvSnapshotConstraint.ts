import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingEnvSnapshotConstraint1767727459349 implements MigrationInterface {
    name = 'AddMissingEnvSnapshotConstraint1767727459349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "envSnapshot" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "envSnapshot" SET NOT NULL`);
    }

}
