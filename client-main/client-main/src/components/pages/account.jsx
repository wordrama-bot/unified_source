import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from 'use-http';

import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../providers/authProvider';
import { useUser } from '../../providers/websocketProvider';

import Notification from '../notification';
import NavBar from '../navbar';

import { API_BASE_URL } from '../../lib/config';

export default function Profile() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    show: false,
    title: '',
    text: '',
    type: 'info'
  });
  const { session } = useAuth();
  const { profile } = useUser();
  const [newPassword, setNewPassword] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const [username, setUsername] = useState(profile.username || session.user.user_metadata.username || '');
  const [email, setEmail] = useState(profile.email || session.user.email);
  const [firstName, setFirstName] = useState(profile.firstname || session.user.user_metadata.firstName || '');
  const [lastName, setLastName] = useState(profile.lastname || session.user.user_metadata.lastName || '');
  const [profileImage, setProfileImage] = useState(
    profile.profile_image !== '' ? profile.profile_image : undefined ||
    session?.user?.user_metadata?.customProfileImage ||
    session?.user?.user_metadata?.avatar_url || 
    '/default.jpeg'
  )
  const hiddenFileInput = useRef(null);

  const { post, delete: deleteAccount, response, loading, error } = useFetch(API_BASE_URL, {
    headers: {
      Authorization: `${session.token_type} ${session.access_token}`
    }
  });

  function handleFileClick(event) {
    event.preventDefault();
    hiddenFileInput.current.click();   
  };

  async function handleDeleteAvatar(event) {
    event.preventDefault();
    const resp = await post('/api/v1/auth/account', {
      firstname: firstName,
      lastname: lastName,
      profileImage: ''
    });
    if (resp.ok) {
      setNotification({
        show: true,
        title: 'Success!',
        text: 'Your profile was updated',
        type: 'info'
      })
    }
    setProfileImage(
      session?.user?.user_metadata?.avatar_url || 
      '/default.jpeg'
    );
  };

  function convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    });
  };

  async function handleFileChange(event) {
    try {
      const file = event.target.files[0];
      if (file.size > 5 * 1000 * 1000) {
        setNotification({ 
          show: true,
          title: 'Image too big',
          text: 'Please use a file under 5MB',
          type: 'warn'
        })
        return;
      }
      const base64 = await convertBase64(file);
      const resp = await post('/api/v1/auth/account', {
        firstname: firstName,
        lastname: lastName,
        profileImage: base64
      });
      if (resp.status === 200){
        setProfileImage(base64);
        setNotification({
          show: true,
          title: 'Success!',
          text: 'Your profile photo was updated',
          type: 'info'
        });
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
  };

  async function handleUpdateAccount() {
    try {
      if (username !== profile.username){
        const usernameRegex = new RegExp("^[a-z0-9\-_\.]+$");
        if (!usernameRegex.test(username)) {
          setNotification({ 
            show: true,
            title: 'Please try another.',
            text: 'Username contains invalid characters',
            type: 'warn'
          });
        }

        const resp = await post('/api/v1/auth/account/username', {
          username
        });
        if (resp.statusText === 'Username taken') {
          setNotification({ 
            show: true,
            title: 'This username is taken',
            text: 'Please try another',
            type: 'warn'
          })
        } else if(resp.status === 200) {
          if (session.user.app_metadata.provider === 'email') {
            await supabase.auth.updateUser({ email })
            setNotification({
              show: true,
              title: 'Success!',
              text: 'Your profile was updated',
              type: 'info'
            });
          }
        }
      }

      if (
        firstName !== profile.firstname ||
        lastName !== profile.lastname
      ) {
        const resp = await post('/api/v1/auth/account', {
          firstname: firstName,
          lastname: lastName,
          profileImage: profile.profile_image
        });
        if (resp.ok) {
          setNotification({
            show: true,
            title: 'Success!',
            text: 'Your profile was updated',
            type: 'info'
          })
        }
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

  async function handleUpdatePassword() {
    try {      
      if (newPassword !== confirmNewPassword) {
        setNotification({ 
          show: true,
          title: 'New passwords don\'t match',
          text: '',
          type: 'warn'
        })
        setNewPassword('');
        setConfirmNewPassword('');
        return;
      } 

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error && error.message.includes('New password should be different')) {
        setNotification({ 
          show: true,
          title: 'Oops...',
          text: error.message,
          type: 'warn'
        })
        setNewPassword('');
        setConfirmNewPassword('');
        return;
      }

      setNewPassword('');
      setConfirmNewPassword('');
      await supabase.auth.signOut();      
      return;
    } catch(err) {
      console.log(err)
      setNewPassword('');
      setConfirmNewPassword('');
      if (err.code === 422) {
        setNotification({ 
          show: true,
          title: 'Oops...',
          text: err.msg,
          type: 'warn'
        })
        return;
      }
      setNotification({ 
        show: true,
        title: 'Oops something went wrong',
        text: 'Please try again later',
        type: 'warn'
      })
    }
  }

  async function handleDeleteAccount(e) {
    e.preventDefault();
    const resp = await deleteAccount('/api/v1/auth/account');
    await supabase.auth.signOut();
    localStorage.removeItem('sb-qflfxxbnhwaxkxsygjqu-auth-token');
    localStorage.removeItem('gameState');
    localStorage.removeItem('gameStats');
    localStorage.removeItem('dailyGameState');
    localStorage.removeItem('dailyGameStats');
    localStorage.removeItem('gameMode');
    localStorage.removeItem('theme');
    localStorage.removeItem('highContrast');
    if (resp.ok) {
      navigate('/');
    }
  }

  async function handleDiscordUnlink(e) {
    e.preventDefault();
    await deleteAccount('/api/v1/auth/account/discord/link');
    return;
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
      <main>
        <div className="divide-y divide-white/5">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
              <h2 className="text-base font-semibold leading-7 text-white">My Profile</h2>
            </div>
            <form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full flex items-center gap-x-8">
                  <img
                    src={profileImage}
                    onClick={handleFileClick}
                    draggable="false" 
                    alt="Profile image"
                    className="h-24 w-24 flex-none rounded-full bg-gray-800 object-cover"
                  />
                  <div className='gap-lg-5 gap-md-4 gap-sm-2'>
                    { profile.profile_image ? (
                      <button
                        onClick={handleDeleteAvatar}
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                      >
                        Delete avatar
                      </button>
                    ) : (
                      <button
                        onClick={handleFileClick}
                        className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                      >
                        Change avatar
                      </button>
                    ) }
                    <input
                      type="file"
                      accept="image/jpeg, image/png"
                      onChange={handleFileChange}
                      ref={hiddenFileInput}
                      style={{ display: "none" }}
                    />
                    <p className="mt-2 text-xs leading-5 text-gray-400">JPG or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-white">
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      name="first-name"
                      id="first-name"
                      value={firstName}
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-white">
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                      name="last-name"
                      id="last-name"
                      value={lastName}
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      disabled={session.user.app_metadata.provider !== 'email'}
                      autoComplete="email"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                    Username
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        pattern="^[a-z0-9\-_\.]+$"
                        minLength="3"
                        maxLength="15"
                        name="username"
                        id="username"
                        value={username}
                        autoComplete="username"
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <a
                  onClick={() => handleUpdateAccount()}
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Save
                </a>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 text-white">Discord Link</h2>
            </div>

            <form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <label 
                    htmlFor={profile.discord_user_id === '' ? 'discord-link-code' : 'discord-username'}
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    { profile.discord_user_id === '' ? 'Link Code' : 'Linked' }
                  </label>
                  <div className="mt-2">
                    <input
                      id={profile.discord_user_id === '' ? 'discord-link-code' : 'discord-username'}
                      name={profile.discord_user_id === '' ? 'discord-link-code' : 'discord-username'}
                      type="text"
                      value={profile.discord_username || profile.discord_link_code}
                      readOnly={true}
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              { profile.discord_link_code === '' ? (
                <div className="mt-8 flex">
                  <a
                    type="submit"
                    onClick={handleDiscordUnlink}
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Unlink
                  </a>
                </div>
              ) : null }
            </form>
          </div>

          { session.user.app_metadata.provider === 'email' ? (
            <>
              <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-white">Change password</h2>
                </div>

                <form className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full">
                      <label htmlFor="new-password" className="block text-sm font-medium leading-6 text-white">
                        New password
                      </label>
                      <div className="mt-2">
                        <input
                          id="new-password"
                          name="new_password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-white">
                        Confirm password
                      </label>
                      <div className="mt-2">
                        <input
                          id="confirm-password"
                          name="confirm_password"
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          autoComplete="new-password"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex">
                    <a
                      type="submit"
                      onClick={() => handleUpdatePassword()}
                      className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Save
                    </a>
                  </div>
                </form>
              </div>

              {
                /*
                If not linked display link code

                Copy link code into discord bot !link <code>
                
                Once linked show discord username instead and an unlink button

                If unlink button clicked generate a new link code

                Link Code can be used in the discord bot by running !verify <code>
                In the backend the bot should;
                - Check the code is valid
                - - If invalid
                    - Reply to user saying code is invalid
                - - If valid
                    - Remove code
                    - Set discord username on profile table
                    - Give user player role in discord
                */
              }
            </>
          ) : null }

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7 text-white">Delete account</h2>
            </div>

            <form className="flex items-start md:col-span-2">
              <a
                onClick={handleDeleteAccount}
                className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
              >
                Yes, delete my account
              </a>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
