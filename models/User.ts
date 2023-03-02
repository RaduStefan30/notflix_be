import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import IUser from "./IUser";

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: [true, "The email is required "],
    validate: [validator.isEmail, "Please provide a valid email"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "The password is required "],
    minlength: [4, "The password should be at least 4 characters long"],
    trim: true,
    select: false,
  },
  profiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this.id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

UserSchema.methods.comparePasswords = async function (
  candidatePassword: string
) {
  const compare = await bcrypt.compare(candidatePassword, this.password);
  return compare;
};

export default mongoose.model<IUser>("User", UserSchema);
