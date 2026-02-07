import { createContext, useContext, useEffect, useState } from "react";
// @ts-ignore
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext({});

export const useAuth = (): any => useContext(AuthContext);

const login = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

function AuthProvider({ children }: any) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: any) => {
      setSession(data?.session)
      setUser(data?.session?.user);
      setLoading(false);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, _session: any) => {
      if (_event === "INITIAL_SESSION") {
        setSession(_session);
        setUser(_session.user);
        setAuth(true);
        setLoading(false);
      } else if (_event === "SIGNED_IN") {
        setSession(_session);
        setUser(_session.user);
        setAuth(true);
        setLoading(false);
      } else if (_event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setAuth(false);
        setLoading(false);
      }
    })

    return () => subscription.unsubscribe()
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, login, loading }}>
      { !loading && children }
    </AuthContext.Provider>
  );
};

export default AuthProvider;