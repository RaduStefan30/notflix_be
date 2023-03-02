import { StatusCodes } from "http-status-codes";

interface IAppError {
  message: string;
  statusCode: StatusCodes;
  status: string;
  isOperational: boolean;
}

const createAppError = (
  message: string,
  statusCode: StatusCodes
): IAppError => ({
  message,
  statusCode,
  status: `${statusCode}`.startsWith("4") ? "fail" : "error",
  isOperational: true,
});

export default createAppError;
