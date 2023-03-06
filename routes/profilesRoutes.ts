import express from "express";
import {
  createProfile,
  editProfile,
  getProfileImages,
  getProfiles,
} from "../controllers/profilesController";
const router = express.Router();

router.route("/").get(getProfiles).post(createProfile).put(editProfile);
router.route("/images").get(getProfileImages);

export default router;
