"use client"

import styles from '../auth.module.css';
import { ThemeSupa } from '@Supabase/auth-ui-shared';
import { Auth } from '@Supabase/auth-ui-react';
import { supabase } from '../../utils/supabase/client';

function UpdatePasswordPage() {
  return (
    <div className="dark:bg-scale-200 bg-scale-100 relative py-2 pb-16">
      <div className="sm:py-18 gap container relative mx-auto grid px-6 py-16 md:gap-16 md:py-24 lg:gap-16 lg:px-16 lg:py-24 xl:px-20">
        <div className="relative col-span-12 mb-16 md:col-span-7 md:mb-0 lg:col-span-6">
          <div className="relative lg:mx-auto lg:max-w-md bg-zinc-900">
            <div className={styles['container-blueshadow']}>
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

                <Auth
                  supabaseClient={supabase}
                  view="update_password"
                  appearance={{
                    theme: ThemeSupa,
                    style: {
                      button: {
                        borderRadius: '10px',
                        borderColor: 'rgba(0,0,0,0)',
                      },
                    },
                    variables: {
                      default: {
                        colors: {
                          brand: 'rgb(8, 107, 177)',
                          brandAccent: 'gray',
                        },
                      },
                    },
                  }}
                  theme="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePasswordPage;
