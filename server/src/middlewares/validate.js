import ApiError from "../utils/ApiError.js";

export const validateRequest = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    throw new ApiError(422, "Validation failed", error.details);
  }
  next();
};
