import express from "express";
import knex from "./database/connection";

const routes = express.Router();

routes.get("/items", async (_, res) => {
  const items = await knex("items").select("*");

  const mapedItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    image_url: `http://localhost:3333/assets/${item.image}`,
  }));

  return res.json(mapedItems);
});

export default routes;
