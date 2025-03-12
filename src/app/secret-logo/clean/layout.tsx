import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yums.fun | Clean Logo",
  description: "Clean logo for Yums.fun",
  robots: "noindex, nofollow",
};

export default function CleanLogoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-navy">
      {children}
    </div>
  );
} 