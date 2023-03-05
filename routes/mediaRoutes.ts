import express from "express";
import { createMedia, getMedia } from "../controllers/mediaController";

const router = express.Router();

router.route("/").get(getMedia).post(createMedia);

export default router;
