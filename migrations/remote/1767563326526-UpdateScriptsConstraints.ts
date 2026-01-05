import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateScriptsConstraints1767563326526 implements MigrationInterface {
    name = 'UpdateScriptsConstraints1767563326526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script-version" DROP CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba"`);
        await queryRunner.query(`ALTER TABLE "script" DROP CONSTRAINT "FK_2b0cd0f537cb8816d4914754983"`);
        await queryRunner.query(`ALTER TABLE "script-run" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "finishedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "script-run" ADD CONSTRAINT "FK_c3e8f3853523d93284a620f0237" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script-version" ADD CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba" FOREIGN KEY ("scriptId") REFERENCES "script"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script" ADD CONSTRAINT "FK_2b0cd0f537cb8816d4914754983" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script" DROP CONSTRAINT "FK_2b0cd0f537cb8816d4914754983"`);
        await queryRunner.query(`ALTER TABLE "script-version" DROP CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba"`);
        await queryRunner.query(`ALTER TABLE "script-run" DROP CONSTRAINT "FK_c3e8f3853523d93284a620f0237"`);
        await queryRunner.query(`ALTER TABLE "script-run" ALTER COLUMN "finishedAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "script-run" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "script" ADD CONSTRAINT "FK_2b0cd0f537cb8816d4914754983" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script-version" ADD CONSTRAINT "FK_03f02d18dd7baf1305d8ca550ba" FOREIGN KEY ("scriptId") REFERENCES "script"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
