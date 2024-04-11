import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { model, Schema, Document } from "mongoose";
import { roleTypes } from "../constants/users.constants";

//declare user type
export interface IUser extends Document {
  active?: boolean;
  city?: string;
  state: string;
  country?: string;
  email: string;
  emailVerified?: boolean;
  google?: boolean;
  name: string;
  password: string;
  phone?: string;
  photo?: string;
  role: string;
  token?: string;
  getResetPasswordToken(): string;
  findAndGenerateToken({ email }: any): any;
  getSignedToken(): string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: string | undefined;
  matchPassword(password: string): boolean | PromiseLike<boolean>;
}
// define user schema
const UserSchema: Schema = new Schema(
  {
    password: {
      type: String,
      required: true,
      select: true,
      minlength: [6, "Please use minimum of 6 characters"],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Can't be blank"],
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please use a valid address"],
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: [roleTypes.owner, roleTypes.tenant],
      default: roleTypes.tenant,
    },
    emailVerified: { type: Boolean, default: false },
    name: String,
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    phone: { type: String, default: '' },
    photo: {
      type: String,
      default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
    active: { type: Boolean, default: true },
    google: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>("save", async function(next: any) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bycrypt.genSalt(10);
  this.password = bycrypt.hashSync(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function(password: string) {
  return await bycrypt.compare(password, this.password);
};
UserSchema.methods.getSignedToken = function(password: string) {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: "48h",
  });
};
UserSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
  return resetToken;
};

UserSchema.methods.transform = function() {
  const transformed = {
    id: this.id,
    email: this.email,
    name: this.name,
    country: this.country,
    city: this.city,
    phone: this.phone,
    role: this.role,
    photo: this.photo,
    createdAt: this.createdAt,
    password: this.password,
    google: this.google,
  };

  return transformed;
};

export const User: any = model("User", UserSchema);
