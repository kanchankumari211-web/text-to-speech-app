/**
 * Centralized Error Handling Middleware
 */

// 404 Route Not Found handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Resource not found: ${req.method} ${req.originalUrl}`,
      status: 404,
      code: 'ROUTE_NOT_FOUND'
    }
  });
};

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  // Handle JSON parse error (400 Bad Request)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid JSON payload in request body',
        status: 400,
        code: 'MALFORMED_JSON'
      }
    });
  }

  // Handle specific HTTP error status codes (400, 401, 403, 404, 429, 500, 503)
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';
  const code = err.code || (status === 503 ? 'SERVICE_UNAVAILABLE' : 'INTERNAL_SERVER_ERROR');

  res.status(status).json({
    success: false,
    error: {
      message,
      status,
      code
    }
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
