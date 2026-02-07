import { Route, Routes } from "react-router-dom";

import Auth from './components/pages/auth';
import AuthRoute from './components/auth/authRoute';
import { useAuth } from "./providers/authProvider";
import Home from './components/pages/home';
import Leaderboard from './components/pages/leaderboard';
import Stats from './components/pages/stats';
import Play from './components/pages/play';
import SetupCustom from './components/pages/setupCustom';
import ManageAccount from './components/pages/account';
import Player from './components/pages/playerProfile';
import NotFound from './components/pages/404';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/account" element={
        <AuthRoute path="/account">
          <ManageAccount />
        </AuthRoute>
      } />
      <Route path="/profile/:userId" element={
        <AuthRoute path="/profile">
          <Player />
        </AuthRoute>
      } />
      <Route path="/leaderboard" element={
        <AuthRoute path="/leaderboard">
          <Leaderboard />
        </AuthRoute>
      } />
      <Route path="/stats" element={
        <AuthRoute path="/stats">
          <Stats />
        </AuthRoute>
      } />
      <Route path="/play" element={
        <AuthRoute path="/play">
          <Play />
        </AuthRoute>
      } />
      <Route path="/play/custom/create" element={
        <AuthRoute path="/play/custom/create">
          <SetupCustom />
        </AuthRoute>
      } />
      <Route path="/play/:shareCode" element={
        <AuthRoute path="/play/:shareCode">
          <Play />
        </AuthRoute>
      } />
      <Route path="/" element={
        user ? <Home /> : <Auth />
      } />
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}
