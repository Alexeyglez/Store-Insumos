import mongoose from "mongoose";

const SingleOrderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  insumo: {
    type: mongoose.Schema.ObjectId,
    ref: "Insumo",
    required: true,
  },
});

const OrderSchema = mongoose.Schema(
  {
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "canceled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.ObjectId,
      ref: "Farmer",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
