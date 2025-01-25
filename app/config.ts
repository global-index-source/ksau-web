// Configuration with fallback values
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080';

export const config = {
  apiEndpoint: API_ENDPOINT,
};