import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/tools/size-guide",
        destination: "/tools/size-guide/index.html",
      },
      {
        source: "/tools/size-guide/",
        destination: "/tools/size-guide/index.html",
      },
      {
        source: "/tools/quimica-lab",
        destination: "/tools/quimica-lab/index.html",
      },
      {
        source: "/tools/quimica-lab/",
        destination: "/tools/quimica-lab/index.html",
      },
      {
        source: "/tools/jogo-damas",
        destination: "/tools/jogo-damas/index.html",
      },
      {
        source: "/tools/jogo-damas/",
        destination: "/tools/jogo-damas/index.html",
      },
      {
        source: "/tools/jogo-xadrez",
        destination: "/tools/jogo-xadrez/index.html",
      },
      {
        source: "/tools/jogo-xadrez/",
        destination: "/tools/jogo-xadrez/index.html",
      },
      {
        source: "/tools/simulador-educacional",
        destination: "/tools/simulador-educacional/index.html",
      },
      {
        source: "/tools/simulador-educacional/",
        destination: "/tools/simulador-educacional/index.html",
      },
    ];
  },
};

export default withNextIntl(nextConfig);