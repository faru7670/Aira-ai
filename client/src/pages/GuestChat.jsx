import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInput from '../components/ChatInput';
import Loader from '../components/Loader';
import MessageBubble from '../components/MessageBubble';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function GuestChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const navigate = useNavigate();

  const sendMessage = async (content) => {
    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get response from AI.');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      <Navbar title="AIRA-AI • Guest Mode" onClear={() => setMessages([])} onLogout={() => navigate('/')} showLogout />
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
        {messages.length === 0 && !loading && (
          <p className="text-center text-sm text-zinc-500">Guest chats are not saved. Ask anything.</p>
        )}
        {messages.map((msg, index) => (
          <MessageBubble key={`${msg.role}-${index}`} role={msg.role} content={msg.content} />
        ))}
        {loading && <Loader />}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div ref={endRef} />
      </section>
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
