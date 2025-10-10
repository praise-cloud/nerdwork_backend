import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// multer.MulterError is the class thrown for multer-specific errors
export const assetSizeLimit = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
    // forward other multer errors as bad request
    return res.status(400).json({ error: error.message || 'File upload error' });
  }

  // not a multer error - treat as internal error
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
};
