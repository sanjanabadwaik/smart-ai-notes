import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { env } from "../config/env.js";

/**
 * Protect routes (JWT authentication)
 */
export const protect = asyncHandler(async (req, _res, next) => {
  let token;

  // 1️⃣ Get token from cookies or Authorization header
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, env.jwt.secret);

    // 3️⃣ Attach user to request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Not authorized, invalid token");
  }
});

/**
 * Role-based access control
 */
export const authorize =
  (...roles) =>
    (req, _res, next) => {
      if (!req.user) {
        throw new ApiError(401, "Not authenticated");
      }

      if (!roles.includes(req.user.role)) {
        throw new ApiError(403, "Access denied");
      }

      next();
    };
