import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1780538554981 implements MigrationInterface {
    name = 'Migration1780538554981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "security_events" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "ip" character varying NOT NULL, "method" character varying NOT NULL, "url" character varying NOT NULL, "userAgent" text, "payload" text, "blocked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6fc100d6700780737348df0d3ae" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "security_events"`);
    }

}
