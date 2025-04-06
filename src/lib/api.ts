
import axios from 'axios';
import { ContactsApiResponse, FilterParams } from '@/types';

const API_BASE_URL = 'https://x2nnoshaqj.execute-api.us-east-2.amazonaws.com/prod';
const DEFAULT_USER_ID = 'test-user';

export const getSignedUploadURL = async (fileName: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload-url`, {
      userId: DEFAULT_USER_ID,
      fileName
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};

export const uploadCSVToSignedURL = async (uploadUrl: string, file: File) => {
  try {
    const response = await axios.put(uploadUrl, file, {
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

export const fetchContacts = async (params: FilterParams): Promise<ContactsApiResponse> => {
  try {
    const userId = params.userId || DEFAULT_USER_ID;
    let url = `${API_BASE_URL}/contacts?userId=${userId}`;
    
    if (params.page) {
      url += `&page=${params.page}`;
    }
    
    if (params.limit) {
      url += `&limit=${params.limit}`;
    }
    
    if (params.field && params.value) {
      url += `&${params.field}=${encodeURIComponent(params.value)}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};
