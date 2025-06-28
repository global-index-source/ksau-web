// Configuration with fallback values
export const config = {
  apiEndpoint: process.env.NEXT_PUBLIC_LOCAL_API_ENDPOINT || process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://project.ksauraj.eu.org',
  endpoints: {
    upload: '/upload'
  }
};
