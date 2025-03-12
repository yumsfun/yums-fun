import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yums.fun | Secret Logo",
  description: "Secret logo page for Yums.fun",
  robots: "noindex, nofollow",
};

export default function SecretLogoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
} 