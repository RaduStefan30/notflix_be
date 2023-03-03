import express from "express";
import {
  createProfile,
  editProfile,
  getProfiles,
} from "../controllers/profilesController";
const router = express.Router();

router.route("/").get(getProfiles).post(createProfile).put(editProfile);

export default router;
