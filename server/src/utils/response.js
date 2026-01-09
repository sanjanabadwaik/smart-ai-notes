export const successResponse = (res, { message = "Operation successful", data = {}, status = 200 }) =>
  res.status(status).json({
    success: true,
    message,
    data,
  });

export const errorResponse = (
  res,
  { message = "Something went wrong", status = 500, errors = [], code }
) =>
  res.status(status).json({
    success: false,
    message,
    errors,
    code,
  });
