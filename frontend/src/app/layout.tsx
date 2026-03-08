import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rishika Singh | AI/ML Student & Aspiring Developer",
  description:
    "Portfolio of Rishika Singh — a Computer Science student specializing in AI, Machine Learning, and backend systems. Explore projects, skills, and experience.",
  keywords: [
    "Rishika Singh",
    "AI",
    "Machine Learning",
    "Portfolio",
    "Computer Science",
    "Developer",
  ],
};

import { EditorProvider } from "@/context/EditorContext";
import AdminSidebar from "@/components/AdminSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <EditorProvider>
          <Navbar />
          {children}
          <AdminSidebar />
          <Footer />
        </EditorProvider>
      </body>
    </html>
  );
}
