import { useEffect, useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import useFetch from 'use-http';
import { Link, useSearchParams } from 'react-router-dom';

import { API_BASE_URL } from '../../lib/config';

const wordLengths = {
  'FIVE': '5 Letter',
  'SIX': '6 Letter', 
  'SEVEN': '7 Letter',
  'EIGHT': '8 Letter',
  'NINE': '9 Letter',
  'TEN': '10 Letter', 
  'ELEVEN': '11 Letter'
};

function WordLengthDropDown({ 
  setStartIndex,
  setWordLength,
  setLeaderboardData,
  setPageByStartIndex,
  wordLength
}) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          { wordLengths[wordLength] }
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {
              Object.keys(wordLengths).map(x => {
                const isActive = x === wordLength;
                return (
                  <Menu.Item key={x}>
                    <a
                        href=""
                        onClick={ e => {
                          e.preventDefault();
                          setLeaderboardData([]);
                          setStartIndex(0);
                          setWordLength(x);
                          setPageByStartIndex();
                        }}
                        className={classNames(
                          isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        { wordLengths[x] }
                    </a>
                  </Menu.Item>
                );
              })
            }
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function EmptyLeaderboard() {
  return (
    <div className="mt-6 text-center">
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white-900 sm:text-5xl">Empty Leaderboard</h1>
      <p className="mt-6 text-base leading-7 text-white-600">Be the first.</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          to="/play"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Play Now
        </Link>
      </div>
    </div>
  )
}

function EmptyPageLeaderboard({ setStartIndex }) {
  return (
    <div className="mt-6 text-center">
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white-900 sm:text-5xl">Page Not Found</h1>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          onClick={ e => {
            e.preventDefault();
            setStartIndex(0);
          } }
          to="/leaderboard"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go Back
        </Link>
      </div>
    </div>
  )
}

function LoadingTable() {
  return (
    <div className="bg-gray-900 py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <strong>Loading...</strong>
          <div
            className="ml-auto inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-info align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          />
        </div>
      </div>
    </div>
  )
}

function ViewProfile({ imageSrc, name, username }) {
  return (
    <Link to={`/profile/${username}`} className="group block flex-shrink-0">
      <div className="flex items-center">
        <div>
          <img
            className="inline-block h-9 w-9 rounded-full"
            src={imageSrc}
            alt=""
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-white group-hover:text-white-900">{ name }</p>
          <p className="text-xs font-medium text-white-500 group-hover:text-white-700">View profile</p>
        </div>
      </div>
    </Link>
  )
}

function Leaderboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const incrementBy = 15;
  const [ leaderboard, setLeaderboardData ] = useState([]);
  const [ leaderboardLength, setLeaderboardLength ] = useState(0);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ startIndex, setStartIndex ] = useState(() => getStartIndexByPage());
  const [ wordLength, setWordLength ] = useState(searchParams.get('word_length') || 'FIVE');
  const { get, response, loading, error } = useFetch(API_BASE_URL, {
    cachePolicy: 'no-cache'
  });

  function getStartIndexByPage() {
    const page = Number(searchParams.get('page') || '1');
    if (page <= 1) return 0;
    return page * incrementBy - 15;
  }

  function setPageByStartIndex() {
    let page = 1;
    
    if (startIndex > 0) {
      page = Math.floor(startIndex / incrementBy) + 1;
    }
    
    searchParams.set('page', page);
    setSearchParams(searchParams);
    return;
  }

  async function getLeaderboard() {
    const resp = await get(`/api/v1/games/wordle/leaderboard?wordlength=${wordLength}&offset=${startIndex}&count=${incrementBy}`);
    if (!response.ok) return;
    else if (resp?.data.length === 0) return;
    setLeaderboardData(resp?.data);
    setLeaderboardLength(resp?.metadata?.leaderboardLength);
    return resp;
  }
  
  async function loadContent() {
    await getLeaderboard();
    setIsLoading(false);
  }

  useEffect(() => { 
    setIsLoading(true);
    loadContent();
  }, [wordLength, startIndex]);

  useEffect(() => {
    const key = 'word_length';
    if (Object.keys(wordLengths).includes(wordLength)) {
      searchParams.set(key, wordLength);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  }, [wordLength]);

  return isLoading ? (
    <LoadingTable />
  ) : (
    <div className="bg-gray-900 py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            { leaderboardLength > 0 || leaderboard.length > 0 ? (
              <h1 className="text-base font-semibold leading-6 text-white">Leaderboard</h1>
            ) : null }
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <WordLengthDropDown
              setStartIndex={setStartIndex}
              setWordLength={setWordLength}
              setLeaderboardData={setLeaderboardData}
              setPageByStartIndex={setPageByStartIndex}
              wordLength={wordLength}
            />
          </div>
        </div>
      </div>
      { leaderboardLength === 0 ? (
        <EmptyLeaderboard />
      ) : (  
        leaderboard.length === 0 ? (
          <EmptyPageLeaderboard setStartIndex={setStartIndex} />
        ) : (
          <>
            <table className="mt-6 w-full whitespace-nowrap text-left">
              <colgroup>
                <col className="w-full sm:w-4/12" />
                <col className="lg:w-4/12" />
                <col className="lg:w-2/12" />
                <col className="lg:w-1/12" />
                <col className="lg:w-1/12" />
              </colgroup>
              <thead className="border-b border-white/10 text-sm leading-6 text-white">
                <tr>
                  <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
                    Place
                  </th>
                  <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
                    User
                  </th>
                  <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
                    Best Streak
                  </th>
                  <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">
                    Current Streak
                  </th>
                  <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">
                    Games Won
                  </th>
                  <th scope="col" className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                    Games Lost
                  </th>
                  <th scope="col" className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.map((item, index) => (
                  <tr key={index}>
                    <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                      {startIndex + index + 1}{startIndex + index + 1 == 1 ? 'st' : ''}{startIndex + index + 1 == 2 ? 'nd' : ''}{startIndex + index + 1 == 3 ? 'rd' : ''}{startIndex + index + 1 > 3 ? 'th' : ''}
                    </td>
                    <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                      {/* <div className="flex items-center gap-x-4">
                        <img src={item.profileImage} alt="" className="h-8 w-8 rounded-full bg-gray-800" />
                        <div className="truncate text-sm font-medium leading-6 text-white">{item.username}</div>
                      </div> */}
                      <ViewProfile imageSrc={item.profileImage} name={item.username} username={item.user_id} />
                    </td>
                    <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                      {item.best_streak}
                    </td>
                    <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
                      {item.current_streak}
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                      {item.games_won}
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                      {item.games_failed}
                    </td>
                    <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                      {item.success_rate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              className="flex items-center justify-between bg-gray-900 px-4 py-3 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-white">
                  Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{startIndex + leaderboard.length}</span> of{' '}
                  <span className="font-medium">{leaderboardLength}</span> results
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
              { startIndex !== 0 ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    
                    if (startIndex <= incrementBy) {
                      setStartIndex(0);
                    } else {
                      setStartIndex(startIndex - incrementBy);
                    }
                    setPageByStartIndex();
                  }}
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-900 hover:text-white focus-visible:outline-offset-0"
                >
                  Previous
                </a> ) : null }
                { startIndex + incrementBy < leaderboardLength ? ( 
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setStartIndex(startIndex + incrementBy);
                      setPageByStartIndex();
                    }}
                    className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-900 hover:text-white focus-visible:outline-offset-0"
                  >
                    Next
                  </a> 
                ) : null }
              </div>
            </nav>
          </>
        )
      ) }
    </div>
  )
}

export default Leaderboard;
