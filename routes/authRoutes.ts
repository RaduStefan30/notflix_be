import express from "express";

import { register, login } from "../controllers/authController";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

// router.route("/updateUser").patch(authenticateUser, updateUser);

export default router;
