export interface FileUploadAdapter {
  getSignedUrl(fileName: string, contentType: string, expiresIn?: number): Promise<{ uploadUrl: string; key: string; publicUrl: string }>;
  deleteFile(key: string): Promise<void>;
}

// Cloudflare R2 adapter (zero cost for reasonable usage)
export class R2FileUploadAdapter implements FileUploadAdapter {
  async getSignedUrl(fileName: string, contentType: string, expiresIn: number = 300): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const key = `uploads/${crypto.randomUUID()}-${fileName}`;
    // Use Cloudflare R2 signed URLs
    const uploadUrl = `https://skillpage-files.r2.dev/${key}`; // Stub - implement proper signed URLs
    const publicUrl = uploadUrl;
    return { uploadUrl, key, publicUrl };
  }

  async deleteFile(key: string): Promise<void> {
    // Delete from R2 (stub - implement with R2 API)
    console.log(`Deleting file: ${key}`);
  }
}

// AWS S3 adapter (paid, for scale)
export class S3FileUploadAdapter implements FileUploadAdapter {
  async getSignedUrl(fileName: string, contentType: string, expiresIn: number = 300): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const key = `uploads/${crypto.randomUUID()}-${fileName}`;
    // Generate AWS S3 presigned URL
    const uploadUrl = `https://skillpage-files.s3.amazonaws.com/${key}`; // Stub
    const publicUrl = uploadUrl;
    return { uploadUrl, key, publicUrl };
  }

  async deleteFile(key: string): Promise<void> {
    console.log(`Deleting file from S3: ${key}`);
  }
}

// Factory function
export function getFileUploadAdapter(): FileUploadAdapter {
  const provider = process.env.FILE_UPLOAD_PROVIDER || 'r2';
  if (provider === 's3') return new S3FileUploadAdapter();
  return new R2FileUploadAdapter();
}
