import { ResponseView } from '../views/responseView.js';

export function errorHandler(err, req, res, next) {
  console.error('[Unhandled Error]:', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return ResponseView.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
}
