import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Instrument_Serif } from 'next/font/google';
import './globals.css';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MedSecure — Your Health Story, Always Within Reach',
  description:
    'A privacy-first digital health record platform. Organize your medical history and share verified health data through secure, patient-controlled QR access.',
  openGraph: {
    title: 'MedSecure — Digital Health Records with Secure QR Access',
    description:
      'Empowering patients to maintain their medical profiles and share vital health data instantly during consultations and emergencies.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${instrumentSerif.variable} scroll-smooth`}>
      <body className="bg-ivory text-dark-brown antialiased selection:bg-sand selection:text-dark-brown min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
