/** @type {import('next').NextConfig} */

const wordramaBuild = (
  process.env.NEXT_PUBLIC_WORDRAMA_BUILD ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GIT_COMMIT_SHA ||
  'local'
).slice(0, 12);

const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allows production builds to complete even if ESLint errors exist.
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_WORDRAMA_BUILD: wordramaBuild,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/ads.txt',
  //       destination: 'https://srv.adstxtmanager.com/19390/wordrama.io',
  //       permanent: true,
  //     },{
  //       source: '/Ads.txt',
  //       destination: 'https://srv.adstxtmanager.com/19390/wordrama.io',
  //       permanent: true,
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/f/**',
      },
    ],
  },
};

export default nextConfig;