import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`[database]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[database]: Error: ${(error as Error).message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;