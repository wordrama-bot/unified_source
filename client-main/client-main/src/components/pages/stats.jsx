import NavBar from '../navbar';
import MyStats from '../tiles/statTiles';

export default function Stats() {  
  return (
    <>
      <div className="min-h-screen">
        <NavBar />

        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <MyStats />
          </div>
        </main>
      </div>
    </>
  )
}
