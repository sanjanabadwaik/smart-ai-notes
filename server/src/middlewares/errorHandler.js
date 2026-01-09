import ApiError from "../utils/ApiError.js";
import { errorResponse } from "../utils/response.js";

export const errorHandler = (err, _req, res, _next) => {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = err.message || "Internal server error";
  const code = isApiError ? err.code : undefined;

  if (process.env.NODE_ENV !== "production") {
    console.error("[error]", err);
  }

  return errorResponse(res, {
    status: statusCode,
    message,
    code,
    errors: err?.errors || [],
  });
};
