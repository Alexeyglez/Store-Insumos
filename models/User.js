import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxLength: 10,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 4,
  },
  role: {
    type: String,
    enum: ["admin", "editor"],
    default: "editor",
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

export default mongoose.model("User", UserSchema);
