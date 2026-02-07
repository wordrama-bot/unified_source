import './index.css';
import App from './App';
import { AlertProvider } from './context/AlertContext';

export default function Wordle() {
  return (
      <AlertProvider>
      <App />
      </AlertProvider>
  )
}
