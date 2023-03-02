import { StatusCodes } from "http-status-codes";
import createAppError from "../utils/appError";
import { Response, NextFunction } from "express";
import User from "../models/User";
import Profile from "../models/Profile";

export const getProfiles = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const profiles = await User.find(userId).select("profiles");
    if (profiles.length) {
      const userProfiles = await Profile.find({ _id: profiles[0].profiles });
      res.status(StatusCodes.OK).json({ userProfiles });
    } else res.status(StatusCodes.NOT_FOUND).json({ userProfiles: [] });
  } catch (error) {
    const appError = createAppError(
      error.message,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    res.status(appError.statusCode).json({ error: appError });
  }
};

export const createProfile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, image } = req.body;

    const userId = req.user.userId;

    const user = await User.findOne(userId);

    if (!user) {
      throw createAppError("User not found", StatusCodes.NOT_FOUND);
    }

    const profiles = await Profile.find({ _id: user.profiles });

    if (profiles.length >= 5) {
      throw createAppError(
        "You can only have 5 profiles",
        StatusCodes.BAD_REQUEST
      );
    }

    if (
      profiles.find(
        (profile) => profile.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      throw createAppError(
        "You already have a profile with that name",
        StatusCodes.BAD_REQUEST
      );
    }

    const profile = await Profile.create({
      name,
      image,
    });

    await user.updateOne({ $push: { profiles: profile._id } });

    res.status(StatusCodes.CREATED).json({ profile });
  } catch (error) {
    const appError = createAppError(
      error.message,
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    );
    next(appError);
  }
};
