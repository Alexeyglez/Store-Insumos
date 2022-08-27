import Insumo from "../models/Insumo.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createInsumo = async (req, res) => {
  const { name, price, description, um } = req.body;
  if (!name || !price || !description || !um) {
    throw new BadRequestError("PLease provide all values");
  }
  const isAlredyName = await Insumo.findOne({ name });
  if (isAlredyName) {
    throw new BadRequestError("Name Insumo is alredy exits");
  }
  req.body.createdBy = req.user.userId;
  const insumo = await Insumo.create(req.body);
  res.status(StatusCodes.CREATED).json({ insumo });
};

export const deleteInsumo = async (req, res) => {
  const { id: insumoId } = req.params;
  const insumo = await Insumo.findOne({ _id: insumoId });
  if (!insumo) {
    throw new NotFoundError(`Not found farmer with id ${insumoId}`);
  }
  await insumo.remove();
  res.status(StatusCodes.OK).json({ msg: "Success insumo removed" });
};

export const getSingleInsumo = async (req, res) => {
  const { id: insumoId } = req.params;
  const insumo = await Insumo.findOne({ _id: insumoId });
  if (!insumo) {
    throw new NotFoundError(`Not found farmer with id ${insumoId}`);
  }
  res.status(StatusCodes.OK).json({ insumo });
};

export const getAllInsumos = async (req, res) => {
  const insumos = await Insumo.find({});
  res.status(StatusCodes.OK).json({ insumos, count: insumos.length });
};

export const updateInsumo = async (req, res) => {
  const { id: insumoId } = req.params;
  const { name, price, description, um } = req.body;
  if (!name || !price || !description || !um) {
    throw new BadRequestError("PLease provide all values");
  }
  const insumo = await Insumo.findOneAndUpdate({ _id: insumoId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!insumo) {
    throw new NotFoundError(`Not found farmer with id ${insumoId}`);
  }
  res.status(StatusCodes.OK).json({ insumo });
};
