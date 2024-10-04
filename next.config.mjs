/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY,
        AZURE_REGION: process.env.AZURE_REGION,
    },
};

export default nextConfig;
