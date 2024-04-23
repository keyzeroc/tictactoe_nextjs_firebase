import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/UI/Navbar";
import SessionProvider from "@/components/auth/SessionProvider";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={"bg-indigo-900 text-gray-50" + " " + inter.className}>
        <SessionProvider session={session}>
          <Navbar />
          <div className="p-4">
            <main className="h-full min-h-full flex flex-col items-center gap-4">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
