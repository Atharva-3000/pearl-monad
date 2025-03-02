/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    images: {
        domains: ['images.unsplash.com', 'avatar.vercel.sh', 'logo.clearbit.com'],
    },
    // Add this configuration
    serverRuntimeConfig: {
      api: {
        // Increase the timeout to 60 seconds (or more if needed)
        bodyParser: {
          sizeLimit: '1mb',
        },
        responseLimit: false,
      },
    },
  }
  
  module.exports = nextConfig 