import MainLayout from '@/components/main-layout';
import Head from 'next/head';

export default function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MainLayout>
      { children }
    </MainLayout>
  )
}
