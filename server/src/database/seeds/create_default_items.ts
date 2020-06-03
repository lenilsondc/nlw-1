import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  return knex("items").insert([
    { title: "Lamps", image: "lamps.svg" },
    { title: "Batteries", image: "batteries.svg" },
    { title: "Pappers", image: "pappers.svg" },
    { title: "Electronics", image: "eletronics.svg" },
    { title: "Organics", image: "organics.svg" },
    { title: "Oils", image: "oils.svg" },
  ]);
}
