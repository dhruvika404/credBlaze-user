/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'app.credblaze.com',
        'uatapp.credblaze.com',
        'localhost:3000',
        'cred-blaze-user.vercel.app'
      ],
    },
  },
};


export default nextConfig;
