export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.stack || err.message || err}`);
  
  if (err.isJoi) {
    return res.status(400).json({ 
      error: 'Validation error',
      message: err.details[0].message,
      details: err.details
    });
  }
  
  if (err.code) {
    switch (err.code) {
      case '23505':
        return res.status(409).json({ 
          error: 'Conflict',
          message: 'Resource already exists'
        });
      case '23503':
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'Referenced resource does not exist'
        });
      case '23502':
        return res.status(400).json({ 
          error: 'Bad Request',
          message: 'Required field missing'
        });
      default:
        console.error('[DB ERROR]', err.code, err.detail);
        return res.status(500).json({ 
          error: 'Database error',
          message: 'An error occurred while processing your request'
        });
    }
  }
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ 
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum size limit'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ 
      error: 'Too many files',
      message: 'Too many files uploaded'
    });
  }
  
  if (err.status || err.statusCode) {
    return res.status(err.status || err.statusCode).json({
      error: err.name || 'Error',
      message: err.message || 'An error occurred'
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'An unexpected error occurred. Please try again later.'
  });
}
