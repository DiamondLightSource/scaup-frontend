/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    API_URL: process.env.API_URL,
  },
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
      {
        source: "/proposals/:proposalId/shipments/:shipmentId/review",
        destination: "/proposals/:proposalId/shipments/:shipmentId/sample/new/review",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
