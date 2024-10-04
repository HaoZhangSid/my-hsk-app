import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "HSK Generator App",
  description: "Generate HSK level texts and convert them to speech",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900`}
      >
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">HSK 短文生成器</h1>
        </header>
        <main className="container mx-auto py-8">
          {children}
        </main>
        <footer className="bg-blue-600 text-white p-4 text-center">
          <p>© 2024 HSK Generator</p>
        </footer>
      </body>
    </html>
  );
}
