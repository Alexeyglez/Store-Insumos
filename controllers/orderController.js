import Insumo from "../models/Insumo.js";
import Order from "../models/Order.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { checkPermissions } from "../utils/index.js";

export const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

export const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

export const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

export const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }

  checkPermissions(req.user, order.user);

  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

export const createOrder = async (req, res) => {
  const { items: cartItems, farmer } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbInsumo = await Insumo.findOne({ _id: item.insumo });
    if (!dbInsumo) {
      throw new NotFoundError(`No insumo with id : ${item.insumo}`);
    }
    const { name, price, _id } = dbInsumo;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      insumo: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  // calculate total
  const total = subtotal;

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    user: req.user.userId,
    farmer: farmer,
  });

  res.status(StatusCodes.CREATED).json({ order });
};
