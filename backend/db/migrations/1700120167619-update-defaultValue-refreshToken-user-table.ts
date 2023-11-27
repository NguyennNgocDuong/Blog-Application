import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDefaultValueRefreshTokenUserTable1700120167619 implements MigrationInterface {
    name = 'UpdateDefaultValueRefreshTokenUserTable1700120167619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
