import './index.css';
import App from './App';
import { AlertProvider } from './context/AlertContext';

export default function Numble() {
  return (
      <AlertProvider>
        <App />
      </AlertProvider>
  )
}
