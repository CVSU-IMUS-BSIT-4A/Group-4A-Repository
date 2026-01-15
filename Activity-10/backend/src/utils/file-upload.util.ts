import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadUtil {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'events');

  constructor() {
    // Ensure uploads directory exists
    this.ensureDirectoryExists(this.uploadsDir);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Save a base64 image data URL to a file
   * @param base64DataUrl - Base64 data URL (e.g., "data:image/png;base64,...")
   * @returns File path relative to uploads directory
   */
  async saveBase64Image(base64DataUrl: string): Promise<string | null> {
    try {
      // Check if it's a data URL
      if (!base64DataUrl || !base64DataUrl.startsWith('data:')) {
        console.log('[FileUpload] Not a data URL, returning as-is');
        // If it's already a URL or path, return as is
        return base64DataUrl;
      }

      // Parse data URL: data:image/png;base64,iVBORw0KGgo...
      const matches = base64DataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        console.log('[FileUpload] Invalid base64 data URL format');
        throw new Error('Invalid base64 data URL format');
      }

      const mimeType = matches[1]; // e.g., "image/png"
      const base64Data = matches[2];
      console.log('[FileUpload] MIME type:', mimeType);
      console.log('[FileUpload] Base64 data length:', base64Data.length);

      // Determine file extension from MIME type
      const extension = this.getExtensionFromMimeType(mimeType);
      if (!extension) {
        console.log('[FileUpload] Unsupported MIME type:', mimeType);
        throw new Error(`Unsupported MIME type: ${mimeType}`);
      }

      // Ensure uploads directory exists
      this.ensureDirectoryExists(this.uploadsDir);
      console.log('[FileUpload] Uploads directory:', this.uploadsDir);

      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
      const filePath = path.join(this.uploadsDir, filename);
      console.log('[FileUpload] Saving to:', filePath);

      // Convert base64 to buffer and save
      const buffer = Buffer.from(base64Data, 'base64');
      console.log('[FileUpload] Buffer size:', buffer.length);

      await fsPromises.writeFile(filePath, buffer);
      console.log('[FileUpload] File saved successfully');

      // Return path relative to uploads directory for serving
      const relativePath = `events/${filename}`;
      console.log('[FileUpload] Returning path:', relativePath);
      return relativePath;
    } catch (error) {
      console.error('[FileUpload] Error saving base64 image:', error);
      return null;
    }
  }

  /**
   * Get file extension from MIME type
   */
  private getExtensionFromMimeType(mimeType: string): string | null {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
    };

    return mimeToExt[mimeType.toLowerCase()] || null;
  }

  /**
   * Delete a file
   */
  deleteFile(filePath: string): void {
    try {
      const fullPath = filePath.startsWith('uploads')
        ? path.join(process.cwd(), filePath)
        : filePath;

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
