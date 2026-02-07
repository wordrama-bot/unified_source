import Image from 'next/image';

export function Loading({ width, height, className }: { width?: number, height?: number, className?: string }) {
  return (
    <Image
      draggable={false}
      className={className || 'flex justify-center items-center'}
      src="/loading.svg"
      alt="Loading Spinner"
      width={width || 100}
      height={height || 100}
    />
  )
}

export default function Loader() {
  return (
    <header className="dark:bg-darkBg inset-0 flex min-h-[80dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
      <Loading
        width={300}
        height={100}
        className='flex justify-center items-center'
      />
      <div className="mx-auto w-container max-w-full px-5 text-center">
        <p className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-3xl lg:text-4xl lg:leading-relaxed">
          Loading...
        </p>
      </div>
    </header>
  )
}
