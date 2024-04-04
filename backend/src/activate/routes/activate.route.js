import express from "express";
import ActivateController from "../controllers/activate.controller.js";
const router = express.Router();
const activateController = new ActivateController();
router.route("/:id").get((req,res,next)=>activateController.verifyActivationLink(req,res,next));

export default router;
