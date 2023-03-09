import express from "express";
import {
  createMedia,
  getMainPageMedia,
  getMedia,
  getMovies,
  getSeries,
} from "../controllers/mediaController";

const router = express.Router();

router.route("/").get(getMedia).post(createMedia);
router.route("/main").get(getMainPageMedia);
router.route("/movies").get(getMovies);
router.route("/series").get(getSeries);

export default router;
