
import axios from 'axios';
import { ENV } from '@/config/env';

export const getSignedUploadURL = async (fileName: string) => {
  try {
    const response = await axios.post(`${ENV.API_BASE_URL}${ENV.CSV_UPLOAD_ENDPOINT}`, {
      fileName,
      fileType: 'text/csv'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};

export const uploadCSVToSignedURL = async (uploadUrl: string, file: File) => {
  try {
    // If local environment, replace IP with localhost
    const finalUploadUrl = uploadUrl.replace('172.18.0.2', 'localhost');
    
    const response = await axios.put(finalUploadUrl, file, {
      headers: {
        'Content-Type': 'text/csv'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading to signed URL:', error);
    throw error;
  }
};
