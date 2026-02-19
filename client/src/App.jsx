import { Navigate, Route, Routes } from 'react-router-dom';
import Chat from './pages/Chat';
import GuestChat from './pages/GuestChat';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/guest" element={<GuestChat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
