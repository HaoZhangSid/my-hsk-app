import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

const cuteFont = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-cute",
  weight: "100 900",
});

const cuteMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-cute-mono",
  weight: "100 900",
});

export const metadata = {
  title: "清泉老师教中文",
  description: "生成可爱的中文短文并转换成语音",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body
        className={`${cuteFont.variable} ${cuteMono.variable} antialiased bg-pink-50 text-pink-900 min-h-screen flex flex-col`}
      >
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <header className="bg-pink-400 text-white p-6 shadow-md">
          <h1 className="text-3xl font-bold text-center animate-pulse-slow">
            ❤️清泉老师教中文❤️
            <p>Tuyen Chinese</p>
          </h1>
          {/* 导航栏 */}
          <nav className="mt-4 flex justify-center space-x-6">
            <Link href="/" className="text-white text-lg font-semibold hover:text-pink-200 transition duration-200">
              首页
            </Link>
            <Link href="/text-to-speech" className="text-white text-lg font-semibold hover:text-pink-200 transition duration-200">
              文本转语音
            </Link>
            {/* <Link href="/about" className="text-white text-lg font-semibold hover:text-pink-200 transition duration-200">
              关于我们
            </Link> */}
          </nav>
        </header>
        
        <main className="container mx-auto py-8 px-4 flex-grow">
          {children}
        </main>
        
        <footer className="bg-pink-400 text-white p-4 text-center w-full">
          <p className="text-sm">
            © 2024 清泉老师教中文 |
            <span className="ml-2 animate-pulse inline-block">❤️</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
