// middlewares/requestLogger.js
const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    const method = req.method;
    const endpoint = req.originalUrl;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const domain = req.get('origin') || req.get('host');

    console.log(`[REQUEST] ${method} ${endpoint}`);
    console.log(`  ├─ IP: ${ip}`);
    console.log(`  └─ Domain: ${domain}\n`);
  }
  next();
};

module.exports = requestLogger;
