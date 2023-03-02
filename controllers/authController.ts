import { Request, Response } from "express";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";
import catchAsync from "../utils/catchAsync";
import appError from "../utils/appError";

const register: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw appError("All fields are required", StatusCodes.BAD_REQUEST);
    }

    const emailAlreadyUsed = await User.findOne({ email });

    if (emailAlreadyUsed) {
      throw appError("Email already used", StatusCodes.BAD_REQUEST);
    }

    const user = await User.create({ email, password });

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      email: user.email,
      token,
    });
  }
);

const login: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw appError("All fields are required", StatusCodes.BAD_REQUEST);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePasswords(password))) {
      throw appError("Incorrect email or password", StatusCodes.UNAUTHORIZED);
    }

    const token = user.createJWT();

    user.password = "";

    res.status(StatusCodes.OK).json({ email, token });
  }
);

export { register, login };
