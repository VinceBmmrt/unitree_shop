import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly config: ConfigService) {}

  /**
   * Generates a pre-signed URL for uploading a file to Cloudflare R2 (S3 compatible)
   * In a real implementation, this would use @aws-sdk/client-s3 and getSignedUrl
   */
  async getUploadUrl(fileName: string, _contentType: string) {
    const bucket = this.config.get<string>('R2_BUCKET_NAME');
    const accountId = this.config.get<string>('R2_ACCOUNT_ID');

    // Placeholder implementation as AWS SDK is not in package.json
    // The user should install @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner
    this.logger.warn(
      'StorageService.getUploadUrl: Placeholder implementation used. Please install AWS SDK.',
    );

    const fileKey = `${Date.now()}-${nanoid(6)}-${fileName}`;

    // This is a mock URL. In production, it would be a real pre-signed URL.
    const uploadUrl = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${fileKey}?X-Amz-Signature=...`;
    const publicUrl = `${this.config.get('R2_PUBLIC_DOMAIN')}/${fileKey}`;

    return {
      uploadUrl,
      publicUrl,
      fileKey,
    };
  }
}
