import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("points", (table) => {
    table.increments("id").primary().notNullable();
    table.string("name").notNullable();
    table.string("image").notNullable();
    table.string("email").notNullable();
    table.string("whatsapp").notNullable();
    table.decimal("latitude").notNullable();
    table.decimal("longitude").notNullable();
    table.string("city").notNullable();
    table.string("state").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("points");
}
