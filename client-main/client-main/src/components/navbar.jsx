import { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import DailySpin from './dailySpin';
import NavStats from './navStats';
import { NotificationHandler } from './notification';
import Logo from '../assets/fulltext-blue.png';

import { useAuth } from '../providers/authProvider';
import { useUser } from '../providers/websocketProvider';

const navigation = [
  { name: 'Home', to: '/', current: true },
  { name: 'Leaderboard', to: '/leaderboard', current: false },
  { name: 'Wordle', to: '/play', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function caplitaliseFirstLetter(str) {
  if (!str) return str;
  const [first, ...rest] = str.split('');
  return `${first.toUpperCase()}${rest.join('')}`
}

function navbar() {
  const { session } = useAuth();
  const { profile } = useUser();
  const [openDailySpin, setOpenDailySpin] = useState(false);
  function handleLogout(e) {
    e.preventDefault();
    supabase.auth.signOut();
    localStorage.removeItem('gameState');
    localStorage.removeItem('gameStats');
    localStorage.removeItem('dailyGameState');
    localStorage.removeItem('dailyGameStats');
    localStorage.removeItem('gameMode');
    localStorage.removeItem('theme');
    localStorage.removeItem('highContrast');
    localStorage.removeItem('confettiEnabled');
    localStorage.removeItem('speedRunMode');
    return;
  }

  return (
    <Fragment>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-32"
                      draggable="false" 
                      src={Logo}
                      alt="Wordrama"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            window.location.pathname === item.to
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={window.location.pathname === item.to ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                      {/* <a
                          key="dailySpin"
                          onClick={
                            (e) => {
                              e.preventDefault();
                              setOpenDailySpin(true);
                              return;
                            }
                          }
                          className={classNames(
                            openDailySpin
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={openDailySpin ? 'page' : undefined}
                        >
                          Daily Spin
                        </a> */}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" /> */}
                    <span className="sr-only">View Coins</span>
                    <NavStats />
                    {/* </button> */}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img 
                            className="h-8 w-8 rounded-full" 
                            draggable="false" 
                            src={
                              profile?.profile_image ||
                              session?.user?.user_metadata?.avatar_url || 
                              '/default.jpeg'
                            } 
                            alt="Profile image" 
                          />
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item key="profile">
                            <Link
                              to={`/profile/${profile.user_id}`}
                              className={classNames(
                                // active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Profile
                            </Link>
                          </Menu.Item>
                          <Menu.Item key="stats">
                            <Link
                              to='/stats'
                              className={classNames(
                                // active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Stats
                            </Link>
                          </Menu.Item>
                          <Menu.Item key="account">
                            <Link
                              to='/account'
                              className={classNames(
                                // active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Account Settings
                            </Link>
                          </Menu.Item>
                          <Menu.Item key="logout">
                            {/* active ? 'bg-gray-100' : '', */}
                            <a
                              href=""
                              onClick={handleLogout}
                              className={classNames('block px-4 py-2 text-sm text-gray-700')}
                            >
                              Logout
                            </a>
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.to}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5 gap-x-5">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={
                        profile?.profile_image ||
                        session?.user?.user_metadata?.avatar_url || 
                        '/default.jpeg'
                      } 
                      alt="Profile image" 
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{session?.user?.user_metadata?.full_name || `${caplitaliseFirstLetter(profile?.firstname)} ${caplitaliseFirstLetter(profile?.lastname)}`}</div>
                    <div className="text-sm font-medium leading-none text-gray-400">{session?.user?.user_metadata?.email || profile?.username}</div>
                  </div>
                  {/* <button
                    type="button"
                    className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" /> */}
                    <span className="sr-only">Coins</span>
                    <NavStats isMenu={true} />
                  {/* </button> */}
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button
                    key="account"
                    as="a"
                    href={`/profile/${profile.user_id}`}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    key="account"
                    as="a"
                    href="/account"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Account Settings
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <NotificationHandler />
      <DailySpin session={session} isOpen={openDailySpin} setOpen={setOpenDailySpin} />
    </Fragment>
  );
}

export default navbar;