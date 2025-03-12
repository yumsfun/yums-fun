import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yums.fun | Transparent Logo",
  description: "Transparent logo for Yums.fun",
  robots: "noindex, nofollow",
};

export default function TransparentLogoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="transparent-bg">
      {children}
    </div>
  );
} 