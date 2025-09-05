import AWSS3Service from "../services/aws-s3.service";

// Initialize services
const s3Service = new AWSS3Service({
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  bucketName: process.env.AWS_S3_BUCKET || "",
  cloudFrontDomain: process.env.AWS_CLOUDFRONT_DOMAIN,
});

// Get presigned upload URL for direct S3 uploads
export const getPresignedUploadUrl = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const {
      filename,
      contentType,
      category = "general",
      purpose = "storage",
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
        timestamp: new Date().toISOString(),
      });
    }

    if (!filename || !contentType) {
      return res.status(400).json({
        success: false,
        error: "Filename and content type are required",
        timestamp: new Date().toISOString(),
      });
    }

    const s3Key = s3Service.generateKey(category, filename, userId);
    const presignedUrl = await s3Service.getPresignedUploadUrl(
      s3Key,
      contentType
    );

    return res.status(200).json({
      success: true,
      data: {
        ...presignedUrl,
        s3Key,
        cdnUrl: s3Service.getPublicUrl(s3Key),
      },
      message: "Presigned upload URL generated successfully",
    });
  } catch (error: any) {
    console.error("Get presigned upload URL error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
};
