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

routes.post("/points", async (req, res) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    state,
    items,
  } = req.body;

  const trx = await knex.transaction();

  const [point_id] = await trx("points").insert({
    image: "",
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    state,
  });

  const pointItems = items.map((item_id: number) => ({
    item_id,
    point_id,
  }));

  await trx("point-items").insert(pointItems);

  return res.json({ succes: true });
});

export default routes;
