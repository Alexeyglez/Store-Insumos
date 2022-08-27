import { Router } from "express";

const router = Router();

import { login, logout, register } from "../controllers/authController.js";

import { authenticateUser } from "../middlewares/authentication.js";

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(authenticateUser, logout);

export default router;
