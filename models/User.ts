import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["student", "faculty", "academics"],
      required: true,
    },
    // Student specific fields
    regNo: {
      type: String,
      unique: true,
      sparse: true, // Allow null/undefined for other roles
    },
    rollNo: {
      type: String,
    },
    fatherName: {
        type: String,
    },
    dob: {
        type: Date
    },
    mobile: {
        type: String
    }
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
