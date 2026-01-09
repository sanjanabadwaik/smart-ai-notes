import { ERROR_CODES } from "../constants/errorCodes.js";

export default class ApiError extends Error {
  constructor(statusCode, message, errors = [], code = ERROR_CODES.UNKNOWN_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
