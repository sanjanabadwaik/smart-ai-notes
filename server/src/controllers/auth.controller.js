import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { successResponse } from "../utils/response.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user
    const user = await User.create({ name, email, password });

    const token = generateToken({ id: user._id });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  successResponse(res, { data: { user } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Find user by email and include the password field
  const user = await User.findOne({ email }).select('+password');
  
  // 2. Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 3. Generate JWT token
  const token = generateToken({ id: user._id });

  // 4. Return success response with user data and token
  successResponse(res, {
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  successResponse(res, {
    success: true,
    message: "Logout successful",
  });
});

export const profile = asyncHandler(async (req, res) => {
  successResponse(res, {
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
  });
});
