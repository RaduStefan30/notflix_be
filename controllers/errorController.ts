//Global error handler
import { StatusCodes } from "http-status-codes";

import appError from "../utils/appError";

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new (appError as any)(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateFieldDB = (err: any) => {
  const value = err.errmsg.match(/"(.*?)"/)[0];
  const message = `Duplicate field value: ${value} Please use a different value`;
  return new (appError as any)(message, StatusCodes.BAD_REQUEST);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new (appError as any)(message, StatusCodes.BAD_REQUEST);
};

const handleJWTError = () =>
  new (appError as any)("Invalid token", StatusCodes.UNAUTHORIZED);

const handleTokenExpiredError = () =>
  new (appError as any)("Expired token", StatusCodes.UNAUTHORIZED);

const sendErrorDev = (err: any, res: any) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: any, res: any) => {
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

export default (err: any, req: any, res: any, next: any) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  let error = Object.assign(err);
  if (error.name === "CastError") error = handleCastErrorDB(err);
  if (error.code === 11000) error = handleDuplicateFieldDB(err);
  if (error.name === "ValidationError") error = handleValidationErrorDB(err);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

  sendErrorDev(error, res);
};
