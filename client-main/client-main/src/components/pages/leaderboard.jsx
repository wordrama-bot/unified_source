import NavBar from '../navbar';
import Table from '../tables/leaderboardTable';

export default function Leaderboard() {  
  return (
    <>
      <div className="min-h-screen">
        <NavBar />

        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Table /> 
          </div>
        </main>
      </div>
    </>
  )
}
