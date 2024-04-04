import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user name is requires"],
    maxLength: [30, "user name can't exceed 30 characters"],
    minLength: [2, "name should have atleast 2 charcters"],
  },
  email: {
    type: String,
    required: [true, "user email is requires"],
    unique: true,
    validate: [ {
      validator: validator.isEmail,
      message: "Please enter a valid email"
    },
    {
      validator: async function(value) {
        const user = await this.constructor.findOne({ email: value });
        return !user; // Return false if user with the same email exists
      },
      message: "Email already exists"
    }],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
  },
  profileImg: {
    public_id: {
      type: String,
      required: true,
      default: "1234567890",
    },
    url: {
      type: String,
      required: true,
      default: "this is dummy avatar url",
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  activationkey:{
    type:String,
    private: true,
    select:false
  },
  isActive:{
    type:Boolean,
    default:false
  },
  resetPasswordToken: {type:String,select:false},
  resetPasswordExpire: {type:Date,select:false}
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) { // Check if password has been modified
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      console.log(hash);
      this.password = hash; // Correctly update the password field
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next(); // Continue to the next middleware if password has not been modified
  }
});

// userSchema.pre("save", async function (next) {
//   if(this.password =="" || !this.password)
//   {
// console.log("inside");
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(this.password, salt);
//     console.log(hash);
//     this.password = hash;
//     next();
//   } catch (error) {
//     next(error);
//   }
// }
// });
userSchema.methods.AddActivationLink = function()
{
 var activationkey= crypto.randomBytes(20).toString('hex');
 this.activationkey = activationkey;
}
// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_Secret, {
    expiresIn: process.env.JWT_Expire,
  });
};
// user password compare
userSchema.methods.comparePassword = async function (password) {
  console.log("this.password"+this.password);
  console.log("pass"+password);
  return await bcrypt.compare(password, this.password);
};

// generatePasswordResetToken
userSchema.methods.getResetPasswordToken =  function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = resetToken.toString();
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
userSchema.statics.getEncrypted = async function(password)
{
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log("userpasswordIncrepted",hash);
    
    return hash;
  }
   catch (error) {
    next(error);
  }
}
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
