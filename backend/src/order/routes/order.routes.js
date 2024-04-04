import express from "express";
import OrderController from "../controllers/order.controller.js";
import { auth } from "../../../middlewares/auth.js";
import createNewOrder from "../controllers/order.controller.js";
const router = express.Router();


router.route("/new").post(auth, createNewOrder);

export default router;
