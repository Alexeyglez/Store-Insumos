import { Router } from "express";

const router = Router();

import {
  authenticateUser,
  authorizePermissions,
} from "../middlewares/authentication.js";

import {
  createInsumo,
  deleteInsumo,
  getAllInsumos,
  getSingleInsumo,
  updateInsumo,
} from "../controllers/insumoController.js";

router
  .route("/")
  .get(authenticateUser, getAllInsumos)
  .post(authenticateUser, createInsumo);

router
  .route("/:id")
  .get(authenticateUser, getSingleInsumo)
  .delete([authenticateUser, authorizePermissions("admin")], deleteInsumo)
  .patch([authenticateUser, authorizePermissions("admin")], updateInsumo);

export default router;
