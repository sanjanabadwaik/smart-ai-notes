import { errorResponse } from "../utils/response.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

export const notFoundHandler = (req, res, _next) =>
  errorResponse(res, {
    status: 404,
    message: `Route ${req.originalUrl} not found`,
    code: ERROR_CODES.ROUTE_NOT_FOUND,
  });
