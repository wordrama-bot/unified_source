"use client";

import styles from '../auth.module.css';
import { useState } from 'react';
import { supabase } from '../../utils/supabase/client';

const classes = {
  'rgb(8, 107, 177)': styles['container-blueshadow'],
};

export default function ForgottenPassword() {
  const brandColor = 'rgb(8, 107, 177)';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage('');
    setErrorMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth-callback`,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setMessage(
        'If an account exists for that email address, a password reset link has been sent.'
      );
    }

    setLoading(false);
  };

  return (
    <div className="dark:bg-scale-200 bg-scale-100 relative py-2 pb-16">
      <div className="sm:py-18 gap container relative mx-auto grid px-6 py-16 md:gap-16 md:py-24 lg:gap-16 lg:px-16 lg:py-24 xl:px-20">
        <div className="relative col-span-12 mb-16 md:col-span-7 md:mb-0 lg:col-span-6">
          <div className="relative lg:mx-auto lg:max-w-md bg-zinc-900">
            <div className={classes[brandColor]}>
              <div className="border-scale-400 bg-scale-300 relative rounded-xl px-8 py-12 drop-shadow-sm">
                <div className="mb-6 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <h1 className="text-scale-1200 text-2xl">
                      <img
                        draggable="false"
                        src="/images/wordrama-logo.png"
                        alt="Wordrama Logo"
                      />
                    </h1>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <label
                    htmlFor="email"
                    className="block text-sm text-white mb-2"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-white"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send reset password instructions'}
                  </button>

                  {message && (
                    <p className="mt-4 text-sm text-green-400">{message}</p>
                  )}

                  {errorMessage && (
                    <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
