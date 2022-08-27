import mongoose from "mongoose";
import validator from "validator";

const FarmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxLength: 10,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    required: [true, "Please provide LastName"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Email invalid",
    },
  },
  direction: {
    type: String,
    required: [true, "Please provide direction"],
    minlength: 3,
    maxLength: 30,
  },
});

export default mongoose.model("Farmer", FarmerSchema);
