const defaultErrorMessage = 'Unknown error';

export function ClientError(err, req, res, next) {
  console.log('Client Error');
  if (err.message) {
    res.status(400).json({
      error: err && err.message || defaultErrorMessage
    });
  } else {
    next(err);
  }
}

export function ApiError(err, req, res, next) {
  console.log('Server Error');
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    error: defaultErrorMessage
  });
}