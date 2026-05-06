export function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((validationError) => ({
      field: validationError.path,
      message: validationError.message,
    }));
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with the same unique value already exists.';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    details,
    error: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
}

export default errorHandler;
