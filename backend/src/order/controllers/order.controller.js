// Please don't change the pre-written code
// Import the necessary modules here

import { ErrorHandler } from "../../../utils/errorHandler.js";
import {createNewOrderRepo} from "../model/order.repository.js";

  const createNewOrder =  async(req, res,next) =>{

    var data = req.body;
    console.log(data);
    var order= await createNewOrderRepo(data);
    if(order)
    {
      res.status(200).json({success:true,msg:"order placed successfully",details:order});
    }
    else{
      res.status(400).json({success:false,msg:"Invalid Response"});
    }
  };  
export default createNewOrder;

