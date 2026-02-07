"use client"
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
// @ts-ignore
import { supabase } from "../utils/supabase/client";

const AuthContext = createContext({});

const login = (
  email: string,
  password: string
) => supabase.auth.signInWithPassword({
  email,
  password
});



function AuthProvider({ children }: any) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState({});
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState('PLAYER');
  const [loading, setLoading] = useState(true);
  const [accountDelete, setAccountDelete] = useState(false);

  const logout = () => {
    supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    setSession(null);
    setUser({});
    setAuth(false);
    setRole('PLAYER');
    setLoading(false);
  }

  const deleteLogout = () => {
    setAccountDelete(true);
    localStorage.clear();
    sessionStorage.clear();
    setSession(null);
    setUser(null);
    setAuth(false);
    setRole('PLAYER');
    Cookies.remove('sb-qflfxxbnhwaxkxsygjqu-auth-token.0');
    Cookies.remove('sb-qflfxxbnhwaxkxsygjqu-auth-token.1');
    Cookies.remove('sb-qflfxxbnhwaxkxsygjqu-auth-token');
    Cookies.remove('sb-qflfxxbnhwaxkxsygjqu-auth-token-code-verifier');
    setLoading(false);
  }

  useEffect(() => {
    if (accountDelete) return;
    supabase.auth.getSession().then(({ data }: any) => {
      setSession(data?.session)
      setUser(data?.session?.user);
      setRole(data?.session?.user?.user_metadata?.role || 'PLAYER');
      setLoading(false);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, _session: any) => {

      if (_event === "INITIAL_SESSION") {
        setSession(_session);
        setUser(_session.user);
        setAuth(true);
        setRole(_session.user?.user_metadata?.role || 'PLAYER');
        setLoading(false);
      } else if (_event === "SIGNED_IN") {
        setSession(_session);
        setUser(_session.user);
        setAuth(true);
        setRole(_session.user?.user_metadata?.role || 'PLAYER');
        setLoading(false);
      } else if (_event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setAuth(false);
        setRole(_session.user?.user_metadata?.role || 'PLAYER');
        setLoading(false);
      }
    })

    return () => subscription.unsubscribe()
  }, []);

  return (
    <AuthContext.Provider value={{
      session, user, role, login, logout, deleteLogout, loading
    }}>
      { !loading && children }
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext) as {
    session: any;
    user: any;
    role: string;
    login: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    deleteLogout: () => Promise<void>;
    loading: boolean;
  };
}

export default AuthProvider;
