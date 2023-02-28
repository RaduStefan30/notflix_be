import { StatusCodes } from "http-status-codes";

export default function handleError(
  this: any,
  message: string,
  statusCode: StatusCodes
) {
  const status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  const isOperational = true;
  Error.captureStackTrace(this, handleError);
  return {
    message,
    statusCode,
    status,
    isOperational,
  };
}
