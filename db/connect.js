import mongoose from "mongoose";

export const connectDB = async (url) => {
  try {
    const connect = await mongoose.connect(url);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
