import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import analysisRouter from './routes/analysis.js';
import { AppError } from './utils/AppError.js';

const app = express();

// 1. Enable Cross-Origin Resource Sharing
app.use(cors());

// 2. Request body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Custom request logger middleware
app.use(requestLogger);

// 4. Mount api endpoints
app.use('/api', healthRouter);
app.use('/api/analysis', analysisRouter);

// 5. Handle unhandled/wildcard routes with custom 404 error
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find endpoint '${req.method} ${req.originalUrl}' on this server`, 404));
});

// 6. Centralized operational/system error handling middleware
app.use(errorHandler);

export default app;
