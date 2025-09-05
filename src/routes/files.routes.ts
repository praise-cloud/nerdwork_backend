import { Router } from "express";
import { authenticate } from "../middleware/common/auth";
import { getPresignedUploadUrl } from "../controller/file.controller";

const router = Router();

/**
 * @swagger
 * /file-upload/presigned-url:
 *   post:
 *     summary: Get a presigned S3 upload URL
 *     description: Generates a presigned URL for direct upload to AWS S3. Requires authentication.
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *               - contentType
 *             properties:
 *               filename:
 *                 type: string
 *                 example: "profile-picture.png"
 *               contentType:
 *                 type: string
 *                 example: "image/png"
 *               category:
 *                 type: string
 *                 default: "general"
 *                 example: "comics"
 *               purpose:
 *                 type: string
 *                 default: "storage"
 *                 example: "avatar"
 *     responses:
 *       200:
 *         description: Presigned URL successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: The presigned S3 upload URL
 *                       example: "https://bucket-name.s3.amazonaws.com/..."
 *                     fields:
 *                       type: object
 *                       description: Form fields required for upload (if using POST upload)
 *                     s3Key:
 *                       type: string
 *                       description: S3 object key for the uploaded file
 *                       example: "comics/12345/profile-picture.png"
 *                     cdnUrl:
 *                       type: string
 *                       description: Public CDN URL to access the uploaded file
 *                       example: "https://cdn.example.com/comics/12345/profile-picture.png"
 *                 message:
 *                   type: string
 *                   example: "Presigned upload URL generated successfully"
 *       400:
 *         description: Missing filename or contentType
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Internal server error
 */

router.post("/presigned-url", authenticate, getPresignedUploadUrl);

export default router;
