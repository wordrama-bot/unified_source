/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
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
