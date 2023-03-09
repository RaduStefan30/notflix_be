import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Media from "../models/Media";
import User from "../models/User";
import createAppError from "../utils/appError";

export const getMedia = async (req: any, res: Response) => {
  try {
    const media = await Media.find();
    res.status(StatusCodes.OK).json({ media });
  } catch (error) {
    const appError = createAppError(
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    res.status(appError.statusCode).json({ error: appError });
  }
};

export const createMedia = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, image, genre, mediaType, isOnMainPage } = req.body;
    const userId = req.user.userId;
    const user = await User.findOne(userId, "profiles");
    if (!user) {
      throw createAppError("User not found", StatusCodes.NOT_FOUND);
    }
    const media = new Media({
      name,
      image,
      genre,
      mediaType,
      isOnMainPage,
    });
    await media.save();
    res.status(StatusCodes.CREATED).json({ media });
  } catch (error) {
    next(error);
  }
};

export const getMainPageMedia = async (req: any, res: Response) => {
  try {
    const media = await Media.find({ isOnMainPage: true });
    res.status(StatusCodes.OK).json({ media });
  } catch (error) {
    const appError = createAppError(
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    res.status(appError.statusCode).json({ error: appError });
  }
};

export const getMovies = async (req: any, res: Response) => {
  try {
    const movies = await Media.find({
      mediaType: "movie",
      // isOnMainPage: false,
    });
    res.status(StatusCodes.OK).json({ movies });
  } catch (error) {
    const appError = createAppError(
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    res.status(appError.statusCode).json({ error: appError });
  }
};

export const getSeries = async (req: any, res: Response) => {
  try {
    const series = await Media.find({
      mediaType: "series",
      // isOnMainPage: false,
    });
    res.status(StatusCodes.OK).json({ series });
  } catch (error) {
    const appError = createAppError(
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    res.status(appError.statusCode).json({ error: appError });
  }
};
