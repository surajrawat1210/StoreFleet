
// 1. Import express.
import express from 'express';
import { addToCart, deletecartItem, getCartItems } from '../controller/cartItems.controller.js';
import { auth } from "../../../middlewares/auth.js";

// 2. Initialize Express router.
const cartRouter = express.Router();

// const cartController = new CartItemsController();

cartRouter.route("/delete/id").post(deletecartItem);
cartRouter.route("/add").post(auth,addToCart);
cartRouter.route("/").get(getCartItems);
// cartRouter.post('/', (req, res, next)=>{
//     cartController.add(req, res, next)
// } );
// cartRouter.get('/', (req, res, next)=>{
//     cartController.get(req, res, next)
// });

export default cartRouter;
