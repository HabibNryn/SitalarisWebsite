// lib/storage.ts
import fs from 'fs/promises'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export interface StorageService {
  uploadFile(fileName: string, buffer: Buffer): Promise<string>
  getFileUrl(fileName: string): Promise<string>
}

// Local Storage Implementation
export class LocalStorageService implements StorageService {
  private basePath: string

  constructor() {
    this.basePath = path.join(process.cwd(), 'public', 'uploads', 'pdfs')
    // Ensure directory exists
    fs.mkdir(this.basePath, { recursive: true }).catch(console.error)
  }

  async uploadFile(fileName: string, buffer: Buffer): Promise<string> {
    const filePath = path.join(this.basePath, fileName)
    await fs.writeFile(filePath, buffer)
    return `/uploads/pdfs/${fileName}`
  }

  async getFileUrl(fileName: string): Promise<string> {
    return `/uploads/pdfs/${fileName}`
  }
}

// S3 Storage Implementation
export class S3StorageService implements StorageService {
  private s3Client: S3Client
  private bucketName: string

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    this.bucketName = process.env.S3_BUCKET_NAME!
  }

  async uploadFile(fileName: string, buffer: Buffer): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `surat-pernyataan/${fileName}`,
      Body: buffer,
      ContentType: 'application/pdf',
      ACL: 'public-read',
    })

    await this.s3Client.send(command)
    return `https://${this.bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/surat-pernyataan/${fileName}`
  }

  async getFileUrl(fileName: string): Promise<string> {
    return `https://${this.bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/surat-pernyataan/${fileName}`
  }
}

// Factory for storage service
export function getStorageService(): StorageService {
  const storageType = process.env.STORAGE_TYPE || 'local'
  
  if (storageType === 's3') {
    return new S3StorageService()
  }
  
  return new LocalStorageService()
}

export const storageService = getStorageService()