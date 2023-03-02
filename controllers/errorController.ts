import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import appError from "../utils/appError";

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return appError(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateFieldDB = (err: any) => {
  const value = err.errmsg.match(/"(.*?)"/)[0];
  const message = `Duplicate field value: ${value} Please use a different value`;
  return appError(message, StatusCodes.BAD_REQUEST);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return appError(message, StatusCodes.BAD_REQUEST);
};

const handleJWTError = () => {
  return appError("Invalid token", StatusCodes.UNAUTHORIZED);
};

const handleTokenExpiredError = () => {
  return appError("Expired token", StatusCodes.UNAUTHORIZED);
};

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  let error = Object.assign(err);
  if (error.name === "CastError") error = handleCastErrorDB(err);
  if (error.code === 11000) error = handleDuplicateFieldDB(err);
  if (error.name === "ValidationError") error = handleValidationErrorDB(err);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(error, res);
  }
};
