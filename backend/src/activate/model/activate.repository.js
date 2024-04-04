import UserModel from "../../user/models/user.schema.js";
export default class ActivateRepository
{

 async VerifyActivationKey(data) {
    const user = await UserModel.updateOne({ activationkey: data,isActive:false },{isActive:true});
    return user;
  // Write your code here for placing a new order
};
}