import { Router } from "express";
import multer from "multer";
import { uploadToS3 } from "../controller/file.controller";

const router = Router();

/**
 * @swagger
 * /file-upload/media:
 *   post:
 *     summary: Upload a file to AWS S3
 *     description: Receives a file, uploads it to AWS S3, and returns the public URL for storage in the database.
 *     tags:
 *       - File Upload
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
 *                   example: "https://cdn.example.com/media/1234abcd-image.png"
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *       400:
 *         description: Bad request, no file provided
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
