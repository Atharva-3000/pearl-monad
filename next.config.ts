/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: [
      '@envio-dev/hypersync-client',
      '@envio-dev/hypersync-client-win32-x64-msvc'
    ],
  },
  images: {
    domains: ['images.unsplash.com', 'avatar.vercel.sh', 'logo.clearbit.com'],
  },
  serverRuntimeConfig: {
    api: {
      bodyParser: {
        sizeLimit: '1mb',
      },
      responseLimit: false,
    },
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };

    // Add this to exclude native modules from browser bundles
    config.externals = [...(config.externals || []), {
      '@envio-dev/hypersync-client': 'commonjs @envio-dev/hypersync-client'
    }];

    return config;
  },
};

module.exports = nextConfig;