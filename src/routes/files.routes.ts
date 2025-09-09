import { Router } from "express";
import multer from "multer";
import { uploadToS3 } from "../controller/file.controller";

const router = Router();
/**
 * @swagger
 * /file-upload/media:
 *   post:
 *     summary: Upload a media file to AWS S3 (organized by creator folder, served via CloudFront)
 *     description: >
 *       Uploads a media file to the configured S3 bucket, organized by creator.
 *       The `Authorization` header (JWT Bearer token) is required. The backend extracts the creator's name from the token and stores the file under a folder named after that creator.
 *       The returned CloudFront-signed URL can be saved in your database and used to serve the media.
 *     tags:
 *       - File Upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: >
 *           Bearer token (JWT). Example: `Bearer eyJhbGciOiJIUzI1NiIsInR...`
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to be uploaded
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   example: "https://d3q14soxsgunx0.cloudfront.net/creators/johndoe/1693847392-xyz.png?Expires=..."
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *       400:
 *         description: Bad request (e.g. no file provided)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: No file uploaded
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: No token provided
 *       403:
 *         description: Forbidden (invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

// Multer memory storage (no disk, file kept in buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint
router.post("/media", upload.single("file"), uploadToS3);

export default router;
