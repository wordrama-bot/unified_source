import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/authProvider";
import LoadingPage from './authLoader';

const AuthenticatedRoute = ({ children, path }) => {
  const { loading, session } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingPage />;
  return session ? 
    children : 
    <Navigate to={"/"} replace state={{ path: location.pathname }} />;
};

export default AuthenticatedRoute;