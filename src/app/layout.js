import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header.js";
import AppProvider from "@/AppContext";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className}>
        <main className="max-w-4xl mx-auto p-4">
          <AppProvider>
            <Toaster />
            <Header />
            {children}
            <footer className="border-t p-8 text-center text-gray-500 mt-16">
              &copy; {new Date().getFullYear()} EJ Pizza. All rights reserved.
            </footer>
          </AppProvider>
        </main>
      </body>
    </html>
  );
}
