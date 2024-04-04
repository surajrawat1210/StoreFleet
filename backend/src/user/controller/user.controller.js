// Please don't change the pre-written code
// Import the necessary modules here

import { sendPasswordResetEmail } from "../../../utils/emails/passwordReset.js";
import { sendWelcomeEmail } from "../../../utils/emails/welcomeMail.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { sendToken,sendLoginToken } from "../../../utils/sendToken.js";
import {
  createNewUserRepo,
  deleteUserRepo,
  findUserForPasswordResetRepo,
  findUserRepo,
  getAllUsersRepo,
  updateUserProfileRepo,
  updateUserRoleAndProfileRepo,comparePasswordIn
} from "../models/user.repository.js";
import crypto from "crypto";

export const createNewUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await createNewUserRepo(req.body);
    
    await sendToken(newUser, res, 200);

    // Implement sendWelcomeEmail function to send welcome message
    await sendWelcomeEmail(newUser);
  } catch (err) {
    //  handle error for duplicate email
    return next(new ErrorHandler(400, err));
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler(400, "please enter email/password"));
    }
    const user = await findUserRepo({ email }, true);
    if (!user) {
      return next(
        new ErrorHandler(401, "user not found! register yourself now!!")
      );
    }
    
    const passwordMatch = await comparePasswordIn(user,password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Invalid email or passswor!"));
    }
    await sendLoginToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const logoutUser = async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ success: true, msg: "logout successful" });
};

export const forgetPassword = async (req, res, next) => {
  var email = req.body.email;
  const user = await findUserRepo({ email }, true);
  if(user)
  {
    console.log(user);
    var resetToken = user.getResetPasswordToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    await user.save({ validateBeforeSave: false });
    console.log(user);
    // await user.save();


    await sendPasswordResetEmail(user,resetToken);
  }
  return res.status(200).json({"success":true});
  
};

export const resetUserPassword = async (req, res, next) => {

  var email = req.body.email;
  var token = req.params.token;
  console.log("token"+token);
  console.log("email"+email);
  const {password, confirmPassword } = req.body;

  if (!password || password !== confirmPassword) {
    return next(
      new ErrorHandler(401, "mismatch new password and confirm password!")
    );
  }
  console.log("helo");
  const user = await findUserRepo({ email,resetPasswordToken:token });
  console.log("got user")
  if(user)
  {
    console.log("Reseting password")
    user.password =password;
    user.resetPasswordToken = null
    user.resetPasswordExpire =null;
    await user.save({validateBeforeSave:false});
    res.status(200).json({"success":true});

  }
  else
  {
  console.log("outside");
  res.status(400).send({"success":false});
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const userDetails = await findUserRepo({ _id: req.user._id });
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    if (!currentPassword) {
      return next(new ErrorHandler(401, "pls enter current password"));
    }

    const user = await findUserRepo({ _id: req.user._id }, true);
    const passwordMatch = await user.comparePassword(currentPassword);
    if (!passwordMatch) {
      return next(new ErrorHandler(401, "Incorrect current password!"));
    }

    if (!newPassword || newPassword !== confirmPassword) {
      return next(
        new ErrorHandler(401, "mismatch new password and confirm password!")
      );
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:false});
    await sendToken(user, res, 200);
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { name, email } = req.body;
  console.log("userId"+req.user._id);
  try {
    const updatedUserDetails = await updateUserProfileRepo(req.user._id, {
      name,
      email,
    });
    res.status(201).json({ success: true, updatedUserDetails });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

// admin controllers
export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await getAllUsersRepo();
    res.status(200).json({ success: true, allUsers });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const getUserDetailsForAdmin = async (req, res, next) => {
  try {
    const userDetails = await findUserRepo({ _id: req.params.id });
    if (!userDetails) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }
    res.status(200).json({ success: true, userDetails });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserRepo(req.params.id);
    if (!deletedUser) {
      return res
        .status(400)
        .json({ success: false, msg: "no user found with provided id" });
    }

    res
      .status(200)
      .json({ success: true, msg: "user deleted successfully", deletedUser });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};
export const resetAndUpdateUser = async(req,res,next) =>{
    const resetPasswordURL = req.params.id;
    const userEmail = req.query.email;
    console.log("userEmail"+userEmail);
    var user = await findUserForPasswordResetRepo(resetPasswordURL,userEmail);
    if(user == null)
    {
        res.status(404).send("Invalid Token with email");
    }
    console.log("user"+user);
    await sendToken(user,res,200);
   
    // Find user by reset password URL and email
    // Implement this logic to verify the reset password URL and retrieve the user from your database
    
    // Redirect user to the reset password page
    // res.redirect(`/reset-password?token=${resetPasswordURL}&email=${userEmail}`);

}
export const resetPassword = async(req,res,next) =>{
  const token = req.query.id;
  const userEmail = req.query.email;

  console.log("userEmail"+userEmail);
  var user = await findUserForPasswordResetRepo(token,userEmail);
  if(user == null)
  {
      res.status(404).send("Invalid Token with email");
  }
  await sendToken(user,res,200);

}
export const updateUserProfileAndRole = async (req, res, next) => {
    var id = req.params.id;
    console.log(id);
    var {email,name,role} =req.body;

    try
      {
          const updatedUserDetails = await updateUserRoleAndProfileRepo(id, {
            name,
            email,
            role
          });
        res.status(201).json({ success: true, updatedUserDetails });
      } catch (error) {
        return next(new ErrorHandler(400, error));
      }
  
};
  // Write your code here for updating the roles of other users by admin
