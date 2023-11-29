/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { REACT_APP_API_URL: process.env.REACT_APP_API_URL },
  async redirects() {
    return [
      {
        source: "/proposals/:proposalId/shipments",
        destination: "/proposals/:proposalId",
        permanent: true,
      },
      {
        source: "/proposals/:proposalId/shipments/:shipmentId",
        destination: "/proposals/:proposalId/shipments/:shipmentId/edit",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
