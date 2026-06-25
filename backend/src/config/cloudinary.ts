import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'lumiere/general'
): Promise<{ secure_url: string; public_id: string }> => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
    transformation: [
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export const uploadMultipleToCloudinary = async (
  filePaths: string[],
  folder: string = 'lumiere/general'
): Promise<{ secure_url: string; public_id: string }[]> => {
  const uploads = filePaths.map((fp) => uploadToCloudinary(fp, folder));
  return Promise.all(uploads);
};

export default cloudinary;
