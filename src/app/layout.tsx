import "./globals.scss";
import "@/styles/components.scss";
import "@/styles/landing.scss";
import "@/styles/dashboard.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
