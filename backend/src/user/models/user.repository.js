// import { urlencoded } from "body-parser";
import UserModel from "./user.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";

export const createNewUserRepo = async (user) => {
  var user = await new UserModel(user);
  user.AddActivationLink()
  return user.save();
};

export const findUserRepo = async (factor, withPassword = false) => {
  if (withPassword) return await UserModel.findOne(factor).select("+password");
  else return await UserModel.findOne(factor);
};
export const comparePasswordIn = async (user,passsword) => {
  return await user.comparePassword(passsword);
};
export const findUserForPasswordResetRepo = async (hashtoken,useremail) => {
  return await UserModel.findOne({
    resetPasswordToken: hashtoken,
    resetPasswordExpire: { $gt: Date.now()},
      email:useremail,
  });
};

export const updateUserProfileRepo = async (_id, data) => {
  return await UserModel.findOneAndUpdate(_id, data, {
    new: true,
    runValidators: false,
    useFindAndModify: true,
  }).exec();
};

export const getAllUsersRepo = async () => {
  return UserModel.find({});
};

export const deleteUserRepo = async (_id) => {
  return await UserModel.findByIdAndDelete(_id);
};

export const updateUserRoleAndProfileRepo = async (_id, data) => {
  return await UserModel.findOneAndUpdate(
    {_id }, // Filter object specifying the document to update based on its _id
    data,         // Update object containing the fields to update
    {
      new: true,            // Return the updated document
      runValidators: false, // Do not run validators during update
      useFindAndModify: false // Use findOneAndUpdate() instead of findAndModify()
    }
  ).exec();
  // Write your code here for updating the roles of other users by admin
};
