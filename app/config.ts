// Configuration with fallback values
export const config = {
  apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://project.ksauraj.eu.org',
  endpoints: {
    quota: '/quota',
    upload: '/upload'
  }
};