import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "C.F. Biggs Task Organizer",
  description: "Track, schedule, and complete tasks."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
