// Please don't change the pre-written code
// Import the necessary modules here

import ActivateRepository from "../model/activate.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export default class ActivateController
{
  constructor()
  {
    this.activateRepository = new ActivateRepository();
  }
  async verifyActivationLink(req, res,next) {

     var activateKey = req.params.id;
    var user = await this.activateRepository.VerifyActivationKey(activateKey);
    console.log(user);
    if(user.matchedCount === 1)
    {
        res.status(200).send({"success":true,"message":"user is now activate"});
        next();
    }
    else
    {
        res.status(400).send({"success":true,"message":"Invalid activationKey"});
    }
    // Write your code here for placing a new order
  };
 
}

