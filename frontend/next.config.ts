import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/pos", destination: "/dashboard", permanent: false },
      { source: "/products", destination: "/dashboard", permanent: false },
      { source: "/inventory", destination: "/dashboard", permanent: false },
      { source: "/expenses", destination: "/dashboard", permanent: false },
      { source: "/vendors", destination: "/dashboard", permanent: false },
      { source: "/quotations", destination: "/dashboard", permanent: false },
      { source: "/quotations/:path*", destination: "/dashboard", permanent: false },
      { source: "/proforma", destination: "/dashboard", permanent: false },
      { source: "/challans", destination: "/dashboard", permanent: false },
      { source: "/credit-notes", destination: "/dashboard", permanent: false },
      { source: "/purchase-orders", destination: "/dashboard", permanent: false },
      { source: "/clients", destination: "/dashboard", permanent: false },
      { source: "/clients/:path*", destination: "/dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
