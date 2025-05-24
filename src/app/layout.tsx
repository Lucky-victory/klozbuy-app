import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {children}
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
