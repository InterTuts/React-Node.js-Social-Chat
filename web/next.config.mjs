// Installed Utils
import createNextIntlPlugin from 'next-intl/plugin';

// Create an instance for NextIntl
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/signin',
        permanent: true
      },
    ];
  },
  reactStrictMode: false,
  webpack(config) {
    config.cache = {
        type: 'filesystem',
        compression: 'gzip',
        allowCollectingMemory: true
    };

    return config;
  }
};
 
export default withNextIntl(nextConfig);