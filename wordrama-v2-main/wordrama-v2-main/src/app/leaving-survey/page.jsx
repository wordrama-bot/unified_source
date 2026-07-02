"use client";

import NavBar from '@/components/navbar/h-nav';
import Footer from '@/sections/footer';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { API_BASE_URL } from '@/lib/config';
import { useEffect, useState } from 'react';
import { freePlayApi } from '@/redux/api/freePlay';
import { friendsApi } from '@/redux/api/friends';
import { systemApi } from '@/redux/api/system';
import { teamApi } from '@/redux/api/teams';
import { wordramaApiV3 } from '@/redux/api/wordrama';
import { useDispatch } from 'react-redux';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';

const reasons = [
  'I stopped playing',
  'Too many bugs',
  'I did not like the game',
  'Privacy or account concern',
  'Ads or monetization',
  'Other',
];

const publicLinks = [
  { href: '/', text: 'Home' },
  { href: '/free-play', text: 'Quick Play' },
  { href: '/marketplace', text: 'Marketplace' },
  { href: '/achievements', text: 'Achievements' },
  { href: '/teams', text: 'Teams' },
  { href: '/about', text: 'About' },
  { href: '/signup', text: 'Sign Up / In' },
];

export default function LeavingSurvey() {
  const { deleteLogout } = useAuth();
  const dispatch = useDispatch();

  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    deleteLogout();

    dispatch(wordramaApiV3.util.resetApiState());
    dispatch(freePlayApi.util.resetApiState());
    dispatch(friendsApi.util.resetApiState());
    dispatch(systemApi.util.resetApiState());
    dispatch(teamApi.util.resetApiState());
  }, [deleteLogout, dispatch]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (submitting || (!reason && !comments.trim())) return;

    try {
      setSubmitting(true);

      await fetch(`${API_BASE_URL}/api/v3/account-deletion-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, comments }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('[LeavingSurvey] feedback submit failed:', error);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg text-text dark:bg-darkBg dark:text-darkText">
      <NavBar links={publicLinks} />

      <main className="container mx-auto flex-1 px-4 py-10">
        <section className="mx-auto mb-8 max-w-2xl rounded-2xl border border-black/10 bg-white p-8 text-center shadow-xl dark:border-white/15 dark:bg-[#111827]">
          <h1 className="mb-3 text-3xl font-bold text-text dark:text-white">
            Your account has been deleted
          </h1>

          <p className="mb-6 text-text/70 dark:text-white/75">
            Thank you for playing Wordrama. We&apos;re sorry to see you go.
          </p>

          <Link
            href="/"
            className="inline-flex rounded-md bg-[#8fdcff] px-6 py-3 font-bold text-black shadow-md transition hover:opacity-90"
          >
            Return to Wordrama
          </Link>
        </section>

        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <section className="rounded-2xl border border-black/10 bg-white p-8 text-center shadow-xl dark:border-white/15 dark:bg-[#111827]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8fdcff] text-3xl font-bold text-black">
                ✓
              </div>

              <h2 className="mb-3 text-2xl font-bold text-text dark:text-white">
                Thanks for the feedback
              </h2>

              <p className="text-text/70 dark:text-white/75">
                We appreciate you giving Wordrama a try.
              </p>
            </section>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-xl dark:border-white/15 dark:bg-[#111827]"
            >
              <div>
                <h2 className="mb-2 text-2xl font-bold text-text dark:text-white">
                  Before you go
                </h2>

                <p className="text-sm text-text/70 dark:text-white/75">
                  This is optional, but your feedback helps improve Wordrama.
                </p>
              </div>

              <div>
                <label className="mb-2 block font-medium text-text dark:text-white">
                  Why are you leaving?
                </label>

                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-3 text-text outline-none focus:border-[#8fdcff] dark:border-white/20 dark:bg-[#030817] dark:text-white"
                >
                  <option value="">Select a reason</option>
                  {reasons.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-text dark:text-white">
                  Anything else you want to share?
                </label>

                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  maxLength={2000}
                  rows={5}
                  className="w-full rounded-md border border-black/15 bg-white px-3 py-3 text-text outline-none placeholder:text-black/40 focus:border-[#8fdcff] dark:border-white/20 dark:bg-[#030817] dark:text-white dark:placeholder:text-white/40"
                  placeholder="Optional feedback..."
                />

                <p className="mt-1 text-right text-xs text-text/50 dark:text-white/50">
                  {comments.length} / 2000
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || (!reason && !comments.trim())}
                className="rounded-md bg-[#8fdcff] px-5 py-3 font-bold text-black shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit feedback'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
      <ThemeSwitcher />
    </div>
  );
}
