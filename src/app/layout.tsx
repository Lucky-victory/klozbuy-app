import type { Metadata } from "next";
import { Providers } from "@/providers";
import { ReactNode } from "react";
import "./globals.css";
export const metadata: Metadata = {
  title: "NaijaNeighborhood Connector",
  description:
    "Connect with local businesses and neighbors in your Nigerian community",
  openGraph: {
    title: "NaijaNeighborhood Connector",
    description:
      "Connect with local businesses and neighbors in your Nigerian community",
    type: "website",
    url: "https://naijaneighborhood.com",
    images: [
      {
        url: "https://naijaneighborhood.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "NaijaNeighborhood Connector",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@naijaneighborhood",
    images: ["https://naijaneighborhood.com/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
