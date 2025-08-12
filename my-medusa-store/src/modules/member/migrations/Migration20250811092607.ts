import { Migration } from '@mikro-orm/migrations';

export class Migration20250811092607 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "member" drop constraint if exists "member_member_number_unique";`);
    this.addSql(`create table if not exists "member" ("id" text not null, "type" text not null, "name" text not null, "phone" text not null, "member_number" text not null, "id_card" text not null, "birthday" timestamptz not null, "email" text not null, "address" text not null, "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "member_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_member_member_number_unique" ON "member" (member_number) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_member_deleted_at" ON "member" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "member" cascade;`);
  }

}
