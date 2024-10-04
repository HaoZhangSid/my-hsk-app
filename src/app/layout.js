import localFont from "next/font/local";
import "./globals.css";

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
        <header className="bg-pink-400 text-white p-6 shadow-md">
          <h1 className="text-3xl font-bold text-center animate-bounce">
            ❤️清泉老师教中文❤️
          </h1>
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
