import { useNavigate } from 'react-router-dom';

function PathHandler({ children }: {children: any}){
  const navigate = useNavigate();
  const currentPath = window.location.pathname
  
  if (currentPath !== '/'){
    navigate(currentPath);
  }
  
  return children;
}

export default PathHandler;