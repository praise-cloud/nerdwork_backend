import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface S3Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  cloudFrontDomain?: string;
}

interface S3UploadResponse {
  key: string;
  bucket: string;
  location: string;
  cdnUrl?: string;
  size?: number;
  contentType?: string;
}

interface S3PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

class AWSS3Service {
  private s3Client: S3Client;
  private config: S3Config;

  constructor(config: S3Config) {
    this.config = config;
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    key: string,
    contentType?: string,
    options?: {
      metadata?: { [key: string]: string };
      acl?: "private" | "public-read" | "public-read-write";
      cacheControl?: string;
    }
  ): Promise<S3UploadResponse> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType || "application/octet-stream",
        Metadata: options?.metadata,
        ACL: options?.acl || "public-read",
        CacheControl: options?.cacheControl || "max-age=31536000", // 1 year default
      });

      await this.s3Client.send(command);

      const location = `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${key}`;
      const cdnUrl = this.config.cloudFrontDomain
        ? `https://${this.config.cloudFrontDomain}/${key}`
        : location;

      return {
        key,
        bucket: this.config.bucketName,
        location,
        cdnUrl,
        size: fileBuffer.length,
        contentType: contentType || "application/octet-stream",
      };
    } catch (error: any) {
      console.error("S3 upload error:", error.message);
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600 // 1 hour default
  ): Promise<S3PresignedUrlResponse> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
        ContentType: contentType,
        ACL: "public-read",
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return {
        uploadUrl,
        key,
        expiresIn,
      };
    } catch (error: any) {
      console.error("S3 presigned URL error:", error.message);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  async getPresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error: any) {
      console.error("S3 presigned download URL error:", error.message);
      throw new Error(
        `Failed to generate presigned download URL: ${error.message}`
      );
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error: any) {
      console.error("S3 delete error:", error.message);
      throw new Error(`Failed to delete file from S3: ${error.message}`);
    }
  }

  async getFileMetadata(key: string): Promise<any> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      return {
        size: response.ContentLength,
        contentType: response.ContentType,
        lastModified: response.LastModified,
        metadata: response.Metadata,
        etag: response.ETag,
      };
    } catch (error: any) {
      console.error("S3 head object error:", error.message);
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }

  generateKey(prefix: string, filename: string, userId?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

    if (userId) {
      return `${prefix}/${userId}/${timestamp}_${random}_${sanitizedFilename}`;
    }

    return `${prefix}/${timestamp}_${random}_${sanitizedFilename}`;
  }

  getPublicUrl(key: string): string {
    if (this.config.cloudFrontDomain) {
      return `https://${this.config.cloudFrontDomain}/${key}`;
    }
    return `https://${this.config.bucketName}.s3.${this.config.region}.amazonaws.com/${key}`;
  }
}

export default AWSS3Service;
export type { S3Config, S3UploadResponse, S3PresignedUrlResponse };
