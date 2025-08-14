import { Migration } from '@mikro-orm/migrations';

export class Migration20250814065246 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "member" add column if not exists "customer_id" text null, add column if not exists "status" text not null default '報到';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "member" drop column if exists "customer_id", drop column if exists "status";`);
  }

}
