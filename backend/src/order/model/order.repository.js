import mongoose from "mongoose";
import OrderModel from "./order.schema.js";


 export const createNewOrderRepo  = async (data)=>
  {
  var newOrder = await new OrderModel(data);
  await newOrder.save();
  return newOrder;
  // Write your code here for placing a new order
  };
