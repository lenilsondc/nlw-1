import { Request, Response } from "express";

import knex from "../database/connection";

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex("items").select("*");

    const mapedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      image_url: `${process.env.SERVER_URL}/assets/${item.image}`,
    }));

    return res.json(mapedItems);
  }
}

export default ItemsController;
