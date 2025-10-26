import dotenv from 'dotenv';
dotenv.config();


export const supabaseConfig = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_ANON_KEY || '',
};

export const s3Config = {
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsRegion: process.env.AWS_REGION || '',
  awsS3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
};