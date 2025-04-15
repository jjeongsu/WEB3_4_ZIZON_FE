import type { Metadata } from 'next';
import './globals.css';
import ReactQueryClientProvider from '@/config/ReactQueryClientProvider';
import localFont from 'next/font/local';
import DesktopNavigation from '@/components/organisms/desktopNavigation/DesktopNavigation';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: '돕당 | DopDang',
  applicationName: '돕당 | DopDang',
  keywords: [
    '돕당',
    'DopDang',
    '전문가',
    '전문가 매칭',
    '전문가 추천',
    '전문가 서비스',
    '전문가 플랫폼',
  ],
  authors: [{ name: '돕당', url: 'https://www.dopdang.shop' }],
  creator: '돕당',
  publisher: '돕당',
  openGraph: {
    title: '💫 돕당 | DopDang',
    description: '전문가 매칭 플랫폼, 돕당에서 당신에게 딱 맞는 전문가를 찾아보세요!',
    url: 'https://www.dopdang.shop',
    siteName: '돕당 | DopDang',
    images: [
      {
        url: '/public/images/dopdang-og.png',
        width: 1200,
        height: 630,
        alt: '돕당 전문가 매칭 플랫폼',
      },
    ],
    locale: 'ko-KR',
    type: 'website',
  },
  description: 'Serve you the professional touch',
};

const pretendard = localFont({
  src: '../../public/font/PretendardVariable.woff2',
  display: 'swap',
  weight: '300 700',
  variable: '--font-pretendard',
  fallback: ['Arial', 'sans-serif'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" className={`${pretendard.variable}`}>
      <body className={`${pretendard.className} bg-black2`}>
        <ReactQueryClientProvider>
          <DesktopNavigation />
          <main className="w-full">{children}</main>
          <Toaster />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
