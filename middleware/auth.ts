import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import appError from "../utils/appError";
import { Response, NextFunction } from "express";

const auth = catchAsync(async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw appError("Access denied!", StatusCodes.UNAUTHORIZED);
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = { id: payload.userId };

    next();
  } catch (error) {
    throw appError("Access denied!", StatusCodes.UNAUTHORIZED);
  }
});

export default auth;
