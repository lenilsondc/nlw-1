import multer from "multer";
import path from "path";
import crypto from "crypto";

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "assets/"),
    filename(_, { originalname }, callback) {
      const hash = crypto.randomBytes(6).toString("hex");
      const fileName = `${hash}-${originalname}`;

      callback(null, fileName);
    },
  }),
};
