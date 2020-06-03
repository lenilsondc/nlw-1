import { Request, Response } from "express";

import knex from "../database/connection";

class PointsController {
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
