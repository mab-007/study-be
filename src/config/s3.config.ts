import { S3Client } from '@aws-sdk/client-s3';
import { s3Config as s3EnvConfig } from './env.config';

if (
  !s3EnvConfig.awsAccessKeyId ||
  !s3EnvConfig.awsSecretAccessKey ||
  !s3EnvConfig.awsRegion ||
  !s3EnvConfig.awsS3BucketName
) {
  console.error('AWS S3 credentials and configuration must be defined in your .env file');
  throw new Error('AWS S3 credentials and configuration must be defined in your .env file');
}

export const s3Client = new S3Client({
  region: s3EnvConfig.awsRegion,
  credentials: {
    accessKeyId: s3EnvConfig.awsAccessKeyId,
    secretAccessKey: s3EnvConfig.awsSecretAccessKey,
  },
});

export const s3Config = s3EnvConfig;