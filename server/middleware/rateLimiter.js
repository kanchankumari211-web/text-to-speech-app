const rateLimit = require('express-rate-limit');

/**
 * Rate limiter middleware to prevent abuse
 * Limits each IP to 60 requests per 15 minutes window
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: 429,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests from this IP. Please wait a few minutes before trying again.',
        status: 429,
        code: 'TOO_MANY_REQUESTS'
      }
    });
  }
});

module.exports = {
  apiRateLimiter
};
