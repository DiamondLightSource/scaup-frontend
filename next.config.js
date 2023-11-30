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
        source: "/proposals/:proposalId/shipments/:shipmentId/edit",
        destination: "/proposals/:proposalId/shipments/:shipmentId/sample/new/edit",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
