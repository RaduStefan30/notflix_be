import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync";
import appError from "../utils/appError.js";
import { Request, Response, NextFunction } from "express";

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    console.log(req.body, email, password);
    if (!email || !password) {
      return next(
        new (appError as any)(
          "All fields are required",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const emailAlreadyUsed = await User.findOne({ email });
    if (emailAlreadyUsed) {
      return next(
        new (appError as any)("Email already used", StatusCodes.BAD_REQUEST)
      );
    }

    const user = await User.create({ email, password });

    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
      user: {
        email: user.email,
      },
      token,
    });
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new (appError as any)(
          "All fields are required",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(
        new (appError as any)(
          "We don't recognize that email & password combination.",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const isPasswordCorrect = await user.comparePasswords(password);
    if (!isPasswordCorrect) {
      return next(
        new (appError as any)(
          "We don't recognize that email & password combination.",
          StatusCodes.UNAUTHORIZED
        )
      );
    }
    const token = user.createJWT();
    user.password = "";
    res.status(StatusCodes.OK).json({ user, token });
  }
);
export { register, login };
