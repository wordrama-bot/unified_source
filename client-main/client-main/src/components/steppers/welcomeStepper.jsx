import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from 'use-http';

import { API_BASE_URL } from '../../lib/config';

import { useUser } from '../../providers/websocketProvider';
import { useAuth } from '../../providers/authProvider';

// Icons
function CompleteTick() {
  return (
    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
    </svg>
  )
}

function NextTick() {
  return (
    <svg class="rtl:rotate-180 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
    </svg>
  )
}

// Classes
const baseClass = 'w-full p-4  border rounded-lg';
const classIsComplete = `${baseClass} text-green-700 border-green-300  bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400`;
const classIsNext = `${baseClass} text-blue-700 bg-blue-100 border-blue-300 dark:bg-gray-800 dark:border-blue-800 dark:text-blue-400`;
const classNotComplete = `${baseClass} text-gray-900 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400`;

// Component
export default function SetupStepper() {
  const defaultStepState= {
    1: {
      name: 'Create an account',
      link: '/',
      onClick: undefined,
      isComplete: true 
    },
    2: {
      name: 'Setup your profile',
      link: '/account',
      onClick: undefined,
      isComplete: false,
      isNext: true
    },
    3: {
      name: 'Play your first game',
      link: '/play',
      onClick: undefined,
      isComplete: false,
      isNext: false
    }
  };

  const { session } = useAuth();
  const { profile, stats } = useUser();
  const [ steps, setSteps ] = useState(defaultStepState);


  const { post, response, loading, error } = useFetch(API_BASE_URL, {
    headers: {
      Authorization: `${session.token_type} ${session.access_token}`
    }
  });

  async function handleUpdate(e) {
    e.preventDefault();
    const resp = await post('/api/v1/auth/account/setup-complete');
    if (resp.ok) {
      setSteps({});
    }
  };

  useEffect(() => {
    if (!profile || !stats) return;
    if (profile.username) {
      setSteps({
        ...defaultStepState,
        2: {
          ...steps['2'],
          isComplete: true,
          isNext: false
        },
        3: {
          ...steps['3'],
          isNext: true
        }
      });
      if (stats?.totalGames?.games_played >= 1) {
        setSteps({
          ...defaultStepState,
          2: {
            ...steps['2'],
            isComplete: true,
            isNext: false
          },
          3: {
            ...steps['3'],
            isComplete: true,
            isNext: false
          },
          4: {
            name: 'Get reward',
            link: '',
            onClick: handleUpdate,
            isComplete: false,
            isNext: true
          }
        })
      }
    }
  }, [profile, stats]);

  return (
    profile && stats && !profile?.account_setup_complete ? (
      <ol className="space-y-4 w-72">
        {
          Object.values(steps).map((step, index) => {
            return (
              <li>
                <Link onClick={step.onClick} to={step.link} >
                  <div className={
                    step.isComplete ? classIsComplete : (
                        step.isNext ? classIsNext : classNotComplete
                    )
                  } role="alert">
                    <div className="flex items-center justify-between">
                      <span className="sr-only">{step.name}</span>
                      <h3 className="font-medium">{index + 1}. {step.name}</h3>
                      { step.isComplete ? <CompleteTick /> : (
                          step.isNext ? <NextTick /> : null
                      )}
                    </div>
                  </div>
                </Link>
            </li>
            )
          })
        }
      </ol>
    ) : null
  )
}