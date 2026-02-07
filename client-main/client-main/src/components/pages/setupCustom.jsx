import { useState, useRef, useEffect } from 'react';
import useFetch from 'use-http';

import { useAuth } from '../../providers/authProvider';
import { useUser } from '../../providers/websocketProvider';

import Notification from '../notification';
import NavBar from '../navbar';

import { API_BASE_URL } from '../../lib/config';

export default function SetupCustom() {
  const [notification, setNotification] = useState({
    show: false,
    title: '',
    text: '',
    type: 'info'
  });
  const { session } = useAuth();
  const { profile } = useUser();
  const [isPublic, setIsPublic] = useState(true);
  const [customWord, setCustomWord] = useState('');
  const [hint, setHint] = useState('');
  //const [shareWith, setShareWith] = useState('');
  const [shareCode, setShareCode] = useState('');

  const { post, response, loading, error } = useFetch(API_BASE_URL, {
    headers: {
      Authorization: `${session.token_type} ${session.access_token}`
    }
  });

  useEffect(() => {
    setNotification({
      show: false,
      title: '',
      text: '',
      type: 'info'
    });
  }, [customWord]);

  async function handleCreate(word) {
    try {
      const body = {
        customWord: word.toUpperCase(),
        isPublic,
      };

      if (hint) {
        body.hint = hint;
      }

      const resp = await post('/api/v1/games/wordle/customs', body);
      console.log(resp)
      if (resp.status === 201 || resp.status === 200) {
        setShareCode(resp.data.share_code);
        console.log(`https://wordrama.io/play/${resp.data.share_code}`)
        setCustomWord('');
        setHint('');
        setNotification({
          show: true,
          title: 'Success!',
          text: 'Custom wordle created',
          type: 'info'
        })
      }
    } catch(err) {
      console.log(err)
      setNotification({ 
        show: true,
        title: 'Oops something went wrong',
        text: 'Please try again later',
        type: 'warn'
      })
    }
  }

  function validateAndCreate() {
    if (customWord.length < 4 || customWord.length > 11) return setNotification({ 
      show: true,
      title: 'Oops',
      text: 'Word must be between 4 and 11 characters long',
      type: 'warn'
    });

    if (!(/^[A-Za-z]+$/.test(customWord))) return setNotification({ 
      show: true,
      title: 'Oops',
      text: 'Word must only contain letters',
      type: 'warn'
    });

    handleCreate(customWord);
  }

  return (
    <>
      <NavBar />
      <Notification 
        show={notification.show}
        setNotification={setNotification}
        title={notification.title}
        text={notification.text} 
        type={notification.type}
      />
      { shareCode ? (
        <main>
          <div className="divide-y divide-white/5">
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-white">Custom Wordle</h2>
              </div>
              <form className="md:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full">
                    <label htmlFor="shareCode" className="block text-sm font-medium leading-6 text-white">
                      Share Code
                    </label>
                    <div className="mt-2">
                      <input
                        id="shareCode"
                        name="shareCode"
                        type="text"
                        value={shareCode}
                        disabled={true}
                        readOnly={true}
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <label htmlFor="shareLink" className="block text-sm font-medium leading-6 text-white">
                      Share Link
                    </label>
                    <div className="mt-2">
                    <input
                      id="shareLink"
                      name="shareLink"
                      type="shareLink"
                      value={`https://${window.location.host}/play/${shareCode}`}
                      disabled={false}
                      readOnly={true}
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                    </div>

                    <div className="mt-8 flex">
                      <a
                        onClick={() => {
                          setShareCode('');
                          setCustomWord('');
                          setHint('');
                          return;
                        }}
                        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Create another
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      ) : (
        <main>
          <div className="divide-y divide-white/5">
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-white">Custom Wordle</h2>
              </div>
              <form className="md:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full">
                    <label htmlFor="customWord" className="block text-sm font-medium leading-6 text-white">
                      Custom Word
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => {
                          setCustomWord(e.target.value)
                        }}
                        id="customWord"
                        name="customWord"
                        type="text"
                        value={customWord}
                        minLength={4}
                        maxLength={11}
                        disabled={false}
                        placeholder="Enter a word between 4 and 11 characters"
                        autoComplete="customWord"
                        className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <label htmlFor="customWord" className="block text-sm font-medium leading-6 text-white">
                      Hint
                    </label>
                    <div className="mt-2">
                    <input
                      onChange={(e) => {
                        setHint(e.target.value)
                      }}
                      id="hint"
                      name="hint"
                      type="text"
                      value={hint}
                      maxLength={120}
                      disabled={false}
                      placeholder="Give a hint (optional)"
                      autoComplete="hint"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                    </div>

                    <div className="mt-8 flex">
                      <a
                        onClick={() => validateAndCreate()}
                        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Create
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      )}
    </>
  )
}
