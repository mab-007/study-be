import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, s3Config } from '../config/s3.config';
import { Readable } from 'stream';

export const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'application/pdf'
) => {
  const params = {
    Bucket: s3Config.awsS3BucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  return await s3Client.send(command);
};

export const readFromS3 = async (fileKey: string): Promise<Buffer> => {
  const params = {
    Bucket: s3Config.awsS3BucketName,
    Key: fileKey,
  };

  const command = new GetObjectCommand(params);
  const response = await s3Client.send(command);

  return new Promise((resolve, reject) => {
    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};
