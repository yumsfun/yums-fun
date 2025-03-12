import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yums.fun | Logo",
  description: "Official logo for Yums.fun",
  robots: "noindex, nofollow",
};

export default function StandaloneLogoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-transparent">
      {children}
    </div>
  );
} 