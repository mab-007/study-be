import dotenv from 'dotenv';
dotenv.config();


export const supabaseConfig = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_ANON_KEY || '',
};