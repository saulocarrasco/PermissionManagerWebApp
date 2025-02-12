/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects(){
    return [
      {
        source: '/',
        destination: '/permissions',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
