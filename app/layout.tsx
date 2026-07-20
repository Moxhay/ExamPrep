import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';
import Sidebar from './components/Sidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Exam prep",
  description: "Exam prep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Suspense fallback={<div className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 print:hidden z-20" />}>
          <Sidebar />
        </Suspense>
        <div className="ml-0 lg:ml-60 lg:in-[.sidebar-collapsed]:ml-14 transition-[margin-left] duration-200 flex flex-col min-h-full print:ml-0">
          {children}
        </div>
      </body>
    </html>
  );
}
