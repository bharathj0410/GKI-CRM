import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import NavBar from "@/components/NavBar";
import { siteConfig } from "@/config/site";
import { poppins } from "./fonts";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className={poppins.variable}>
      <head />
      <body>
        <Providers themeProps={{ attribute: "class", defaultTheme: "light", enableSystem: false }}>
          <AuthProvider>
            <div className="relative flex h-screen light font-poppins">
              <NavBar />
              <main className="container flex-grow">
                {children}
              </main>
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
