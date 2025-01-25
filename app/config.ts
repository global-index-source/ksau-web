// Configuration with fallback values
export const config = {
  apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8080',
};

// Validate environment at build time
if (!process.env.NEXT_PUBLIC_API_ENDPOINT && process.env.NODE_ENV === 'production') {
  console.warn(
    'Warning: NEXT_PUBLIC_API_ENDPOINT is not set. Using default development endpoint.'
  );
}