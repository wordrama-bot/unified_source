"use client"
import styles from '../auth.module.css';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Auth } from '@supabase/auth-ui-react';
import { useState } from 'react';
import { supabase } from '../../utils/supabase/client';

const classes = {
  'rgb(202, 37, 37)': styles['container-redshadow'],
  'rgb(65, 163, 35)': styles['container-greenshadow'],
  'rgb(8, 107, 177)': styles['container-blueshadow'],
  'rgb(137, 207, 240)': styles['container-blueshadow'],
  'rgb(235, 115, 29)': styles['container-orangeshadow']
};
const colors = [
  'rgb(202, 37, 37)',
  'rgb(65, 163, 35)',
  'rgb(8, 107, 177)',
  'rgb(235, 115, 29)',
  'rgb(137, 207, 240)'
];
const socialAlignments = ['horizontal', 'vertical'];
const radii = ['5px', '10px', '20px'];
const views = [
  { id: 'sign_in', title: 'Sign In' },
  { id: 'sign_up', title: 'Sign Up' },
  { id: 'magic_link', title: 'Magic Link' },
  { id: 'forgotten_password', title: 'Forgotten Password' },
  { id: 'update_password', title: 'Update Password' },
  { id: 'verify_otp', title: 'Verify Otp' },
];

function AuthComponent() {
  const [brandColor, setBrandColor] = useState(colors[2])
  const [borderRadius, setBorderRadius] = useState(radii[1])
  const [theme, setTheme] = useState('dark')
  const [socialLayout, setSocialLayout] = useState(socialAlignments[1])
  const [view, setView] = useState(views[3])

  return (
    <div className="dark:bg-scale-200 bg-scale-100 relative py-2 pb-16">
      {/* grid-cols-12 */}
      <div className="sm:py-18 gap container relative mx-auto grid  px-6 py-16 md:gap-16 md:py-24 lg:gap-16 lg:px-16 lg:py-24 xl:px-20">
        <div className="relative col-span-12 mb-16 md:col-span-7 md:mb-0 lg:col-span-6">
          <div className="relative lg:mx-auto lg:max-w-md bg-zinc-900">
            <div className={classes[brandColor]}>
              <div className="border-scale-400 bg-scale-300 relative rounded-xl px-8 py-12 drop-shadow-sm">
                <div className="mb-6 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <h1 className="text-scale-1200 text-2xl">
                      <img draggable="false" src="https://utfs.io/f/vieUBZcrouNZQrdaKfbRj7hpV6g4Axl20D3nvSc9I1BEkdqr" />
                    </h1>
                  </div>
                </div>
                <Auth
                  supabaseClient={supabase}
                  view={view.id}
                  magicLink={true}
                  appearance={{
                    theme: ThemeSupa,
                    style: {
                      button: {
                        borderRadius: borderRadius,
                        borderColor: 'rgba(0,0,0,0)',
                      },
                    },
                    variables: {
                      default: {
                        colors: {
                          brand: brandColor,
                          brandAccent: `gray`,
                        },
                      },
                    },
                  }}
                  providers={['discord']}
                  socialLayout={socialLayout}
                  theme={theme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthComponent;
