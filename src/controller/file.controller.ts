import s3Service from "../services/aws-s3.service";

export const uploadToS3 = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const url = await s3Service.uploadFile(req.file, "media");

    return res.status(200).json({
      success: true,
      url,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
