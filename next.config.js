/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/proposals/:proposalId/sessions/:visitNumber/shipments",
        destination: "/proposals/:proposalId/sessions/:visitNumber",
        permanent: true,
      },
      {
        source: "/proposals/:proposalId",
        destination: "/proposals/:proposalId/shipments",
        permanent: true,
      },
      {
        source: "/proposals/:proposalId/sessions/:visitNumber/shipments/:shipmentId/edit",
        destination:
          "/proposals/:proposalId/sessions/:visitNumber/shipments/:shipmentId/sample/new/edit",
        permanent: true,
      },
      {
        source: "/proposals/:proposalId/sessions/:visitNumber/shipments/:shipmentId/review",
        destination:
          "/proposals/:proposalId/sessions/:visitNumber/shipments/:shipmentId/sample/new/review",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
