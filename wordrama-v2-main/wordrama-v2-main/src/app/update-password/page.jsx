"use client"

import { useState } from 'react';
import styles from '../auth.module.css';
import { supabase } from '../../utils/supabase/client';

function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="dark:bg-scale-200 bg-scale-100 relative py-2 pb-16">
      <div className="sm:py-18 gap container relative mx-auto grid px-6 py-16 md:gap-16 md:py-24 lg:gap-16 lg:px-16 lg:py-24 xl:px-20">
        <div className="relative col-span-12 mb-16 md:col-span-7 md:mb-0 lg:col-span-6">
          <div className="relative lg:mx-auto lg:max-w-md bg-zinc-900">
            <div className={styles['container-blueshadow']}>
              <div className="border-scale-400 bg-scale-300 relative rounded-xl px-8 py-12 drop-shadow-sm">
                <div className="mb-6">
                  <img
                    draggable="false"
                    src="/images/wordrama-logo.png"
                    alt="Wordrama Logo"
                  />
                </div>

                {success ? (
                  <div className="flex flex-col gap-5">
                    <h2 className="text-xl font-semibold text-white">
                      Password updated
                    </h2>

                    <p className="text-zinc-300">
                      Your password has been changed successfully.
                    </p>

                    <button
                      type="button"
                      onClick={() => window.location.href = '/'}
                      className="rounded-md bg-sky-700 px-4 py-3 font-medium text-white hover:bg-sky-600"
                    >
                      Continue to Wordrama
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm text-zinc-300"
                      >
                        New password
                      </label>

                      <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        className="w-full rounded-md border border-zinc-500 bg-zinc-800 px-4 py-3 text-white caret-white placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none"
                        placeholder="Enter your new password"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="mb-2 block text-sm text-zinc-300"
                      >
                        Confirm new password
                      </label>

                      <input
                        id="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                        className="w-full rounded-md border border-zinc-500 bg-zinc-800 px-4 py-3 text-white caret-white placeholder:text-zinc-400 focus:border-sky-500 focus:outline-none"
                        placeholder="Confirm your new password"
                      />
                    </div>

                    {error && (
                      <div className="rounded-md border border-red-500 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-md bg-sky-700 px-4 py-3 font-medium text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Updating password...' : 'Update password'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePasswordPage;
