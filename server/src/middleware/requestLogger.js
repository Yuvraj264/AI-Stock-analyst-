/**
 * Custom request logging middleware.
 * Captures request details and log metrics such as status code and execution duration
 * once the response finishes streaming.
 */
export const requestLogger = (req, res, next) => {
  const start = process.hrtime();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Listen for the finish event on response stream to log completion metrics
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    
    const method = req.method;
    const url = req.originalUrl || req.url;
    const status = res.statusCode;

    // Apply basic console coloring based on status classes
    let color = '\x1b[0m'; // Reset
    if (status >= 500) {
      color = '\x1b[31m'; // Red
    } else if (status >= 400) {
      color = '\x1b[33m'; // Yellow
    } else if (status >= 300) {
      color = '\x1b[36m'; // Cyan
    } else if (status >= 200) {
      color = '\x1b[32m'; // Green
    }

    console.log(
      `[Request] ${method} ${url} -> ${color}${status}\x1b[0m | ${durationMs}ms | IP: ${ip}`
    );
  });

  next();
};
export default requestLogger;
