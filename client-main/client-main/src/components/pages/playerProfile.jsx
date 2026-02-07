import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from 'use-http';

import NavBar from '../navbar';

import { API_BASE_URL } from '../../lib/config';

export default function PlayerProfile() {
  const { userId } = useParams();
  const [ profile, setProfile ] = useState({});
  const [ isLoading, setIsLoading ] = useState(false);
  const { get, response, loading, error } = useFetch(API_BASE_URL, {
    cachePolicy: 'no-cache'
  });

  async function getProfile() {
    setIsLoading(true);
    const resp = await get(`/api/v1/auth/account/public/${userId}`);
    if (response.ok) {
      setProfile(resp?.data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
      <div className="bg-white">
        <NavBar />
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:max-w-lg lg:self-end">
            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{ profile?.username || 'Anonymous Player' }</h1>
            </div>

            <section aria-labelledby="information-heading" className="mt-4">
              <h2 id="information-heading" className="sr-only">
                Player info
              </h2>

              <div className="flex items-center">
                <p className="text-lg text-gray-900 sm:text-xl">Level {profile?.level}</p>
                <div className="ml-4 border-l border-gray-300 pl-4">
                  <div className="flex items-center">
                  <p className="text-lg text-gray-900 sm:text-xl">{profile?.stats?.games_played} games played</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-gray-700">XP to next level</span>
                  <span className="text-sm font-medium text-gray-700">{ profile?.xp_to_next_level - profile?.xp } xp</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.round((profile?.xp / profile?.xp_to_next_level) * 100)}%` }}></div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
              <img 
                src={
                  profile.profile_image !== '' ? 
                  profile.profile_image : undefined ||
                  '/default.jpeg'
                }
                alt="Profile Image"
                className="h-full w-full object-cover object-center" 
              />
            </div>
          </div>

          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            
          </div>
        </div>
      </div>
  )
}

