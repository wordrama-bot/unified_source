import MainLayout from '@/components/main-layout'; 

export default function Layout({ 
  children 
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <MainLayout className='bg-[#1C1C1C]'>
      { children }
    </MainLayout>
  )
}