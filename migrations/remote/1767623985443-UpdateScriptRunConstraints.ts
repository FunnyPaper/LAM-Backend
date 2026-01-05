import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateScriptRunConstraints1767623985443 implements MigrationInterface {
    name = 'UpdateScriptRunConstraints1767623985443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script-run" DROP CONSTRAINT "FK_58640f153e7c1fbabdb0e0cef31"`);
        await queryRunner.query(`ALTER TABLE "script-run" DROP CONSTRAINT "FK_dc8e220962484612363f774b8e6"`);
        await queryRunner.query(`ALTER TABLE "script-run" ADD CONSTRAINT "FK_58640f153e7c1fbabdb0e0cef31" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script-run" ADD CONSTRAINT "FK_dc8e220962484612363f774b8e6" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "script-run" DROP CONSTRAINT "FK_dc8e220962484612363f774b8e6"`);
        await queryRunner.query(`ALTER TABLE "script-run" DROP CONSTRAINT "FK_58640f153e7c1fbabdb0e0cef31"`);
        await queryRunner.query(`ALTER TABLE "script-run" ADD CONSTRAINT "FK_dc8e220962484612363f774b8e6" FOREIGN KEY ("envId") REFERENCES "env"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "script-run" ADD CONSTRAINT "FK_58640f153e7c1fbabdb0e0cef31" FOREIGN KEY ("scriptVersionId") REFERENCES "script-version"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
