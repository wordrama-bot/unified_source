import { Fragment, useEffect, useState, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Wheel } from 'react-custom-roulette';
import useFetch from 'use-http';

import { useAuth } from '../providers/authProvider';

import { API_BASE_URL } from '../lib/config';

export default function DailySpin({ isOpen = false, setOpen }) {
  const { session } = useAuth();
  const colours = ['#cd4548', '#1691d4', '#62b48c', '#ffa20f', '#7b6bb7'];
  const [spin, setSpin] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownData, setCountdownData] = useState({ 
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [prizeData, setPrizeData] = useState();
  const [prizeIndex, setPrizeIndex] = useState();
  const [dailySpinData, setDailySpinData] = useState({});
  const { get, post, response, loading, error } = useFetch(API_BASE_URL, {
    headers: {
      Authorization: `${session?.token_type} ${session?.access_token}`
    }
  });

  async function initializePrize() {
    const resp = await get('/api/v1/economy/daily-spin');
    if (response.ok) {
      setDailySpinData(resp.data);
      setPrizeData(resp.prizes.map((
        { 
          prize_name: prizeName 
        }, 
        index
      ) => {
        return { 
          option: prizeName, 
          style: { 
            backgroundColor: colours[index], 
            textColor: 'white' 
          } 
        }
      }));
      setPrizeIndex(resp.prizeIndex);
    }

    if (
      resp.status === 400 && 
      resp.statusText.startsWith('Not enough time has passed')
    ) {
      setShowCountdown(true);
      setDailySpinData(resp.data);
    }
  }

  async function claimPrize() {
    const resp = await post('/api/v1/economy/daily-spin/claim');
    if (response.ok) console.log(resp);
  }
    
  useEffect(() => { 
    initializePrize();
  }, []);
  
  useEffect(() => {
    let hours, minutes, seconds = 0;
    const countDownDate = new Date().setHours(24,0,0,0);
    let x = setInterval(function() {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdownData({ hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(x);
        showCountdown(false);
        setCountdownData({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
  }, [showCountdown]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      { !showCountdown && dailySpinData ? 'Daily Spin' : null }
                      { showCountdown ? (
                        <> 
                          { 
                            `You won ${dailySpinData?.prize_coin_count} coin${dailySpinData?.prize_coin_count > 1 ? 's' : ''}` 
                          }
                          <br/>
                          { 
                            `Spin again in ${countdownData.hours} hours, ${countdownData.minutes} minutes, ${countdownData.seconds} seconds` 
                          }
                        </>
                      ) : null }
                    </Dialog.Title>

                    <div className="mt-2">
                      { loading ? (
                        <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                        </svg>
                      ) : null}

                      { !showCountdown && dailySpinData  ? (
                        <Wheel
                          mustStartSpinning={spin}
                          prizeNumber={prizeIndex + 1}
                          data={prizeData}
                          backgroundColors={['#3e3e3e', '#df3428']}
                          textColors={['#ffffff']}
                          onStopSpinning={async () => {
                            setShowCountdown(true);
                            await claimPrize();
                          }}
                        /> 
                      ) : null }
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  { !showCountdown ? (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={() => setSpin(true)}
                    >
                      Spin
                    </button>
                  ) : null }
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
                
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
};
