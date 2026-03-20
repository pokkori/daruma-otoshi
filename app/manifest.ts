import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ダルマ落とし PHYSICS",
    short_name: "ダルマ落とし",
    description: "だるまタワーを下から叩いて抜く本格物理パズル。インストール不要でブラウザで今すぐ遊べる！",
    start_url: "/",
    display: "standalone",
    background_color: "#1a0005",
    theme_color: "#ff6b2b",
    orientation: "portrait",
    icons: [
      { src: "/images/daruma_stack.png", sizes: "192x192", type: "image/png" },
      { src: "/og.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
