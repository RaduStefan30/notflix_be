import express from "express";
import { createProfile, getProfiles } from "../controllers/profilesController";
const router = express.Router();

router.route("/").get(getProfiles).post(createProfile);

export default router;
