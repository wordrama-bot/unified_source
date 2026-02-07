function MaintenanceMode(){
  return (
    <main className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-300"></p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white-900 sm:text-5xl">
          Maintenance Mode
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-300">Sorry we are performing some maintenance, check back later.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {/* <Link
            to="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
          >
            Go back home
          </Link> */}
        </div>
      </div>
    </main>
  );
};

export default MaintenanceMode;
