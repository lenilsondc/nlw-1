import { Request, Response } from "express";

import knex from "../database/connection";

class PointsController {
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return res.status(404).json({ message: `Point (id = ${id}) no found` });
    }

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.id", id)
      .select("title");

    return res.json({ ...point, items });
  }

  async create(req: Request, res: Response) {
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

    const point = {
      image: "",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      state,
    };

    const trx = await knex.transaction();
    const [point_id] = await trx("points").insert(point);

    const pointItems = items.map((item_id: number) => ({
      item_id,
      point_id,
    }));

    await trx("point_items").insert(pointItems);

    await trx.commit();

    return res.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;
