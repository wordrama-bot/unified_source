import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// @ts-ignore
import App from './App';
import AuthProvider from './providers/authProvider';
import WebSocketProvider from './providers/websocketProvider';
import './app.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <AuthProvider>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </AuthProvider>
  </BrowserRouter>
);
