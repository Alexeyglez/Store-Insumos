import Farmer from "../models/Farmer.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createFarmer = async (req, res) => {
  const { name, lastName, email, direction } = req.body;
  if (!name || !lastName || !email || !direction) {
    throw new BadRequestError("PLease provide all values");
  }
  const isAlredyEmail = await Farmer.findOne({ email });
  if (isAlredyEmail) {
    throw new BadRequestError("Email alredy exits");
  }
  const farmer = await Farmer.create({ name, lastName, email, direction });
  res.status(StatusCodes.CREATED).json({ farmer });
};

export const deleteFarmer = async (req, res) => {
  const { id: farmerId } = req.params;
  const farmer = await Farmer.findOne({ _id: farmerId });
  if (!farmer) {
    throw new NotFoundError(`Not found farmer with id ${farmerId}`);
  }
  await farmer.remove();
  res.status(StatusCodes.OK).json({ msg: "Success farmer removed" });
};

export const getSingleFarmer = async (req, res) => {
  const { id: farmerId } = req.params;
  const farmer = await Farmer.findOne({ _id: farmerId });
  if (!farmer) {
    throw new NotFoundError(`Not found farmer with id ${farmerId}`);
  }
  res.status(StatusCodes.OK).json({ farmer });
};

export const getAllFarmers = async (req, res) => {
  const farmers = await Farmer.find({});
  res.status(StatusCodes.OK).json({ farmers, count: farmers.length });
};

export const updateFarmer = async (req, res) => {
  const { id: farmerId } = req.params;
  const { name, lastName, email, direction } = req.body;
  if (!name || !lastName || !email || !direction) {
    throw new BadRequestError("PLease provide all values");
  }
  const farmer = await Farmer.findOneAndUpdate({ _id: farmerId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!farmer) {
    throw new NotFoundError(`Not found farmer with id ${farmerId}`);
  }
  res.status(StatusCodes.OK).json({ farmer });
};
