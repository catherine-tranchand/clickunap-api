/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcrypt', 'jsonwebtoken'],

  async headers() {
    return [
      {
        source: '/(.*)', // b4: /:path*
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "*",
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS, PATCH, DELETE, POST, PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  }
};

export default nextConfig;
