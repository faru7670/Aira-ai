import { useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ChatInput from '../components/ChatInput';
import Loader from '../components/Loader';
import MessageBubble from '../components/MessageBubble';
import Navbar from '../components/Navbar';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Chat() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);
      const response = await fetch(`${API_URL}/api/history/${currentUser.uid}`);
      const data = await response.json();
      setMessages(data.messages || []);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const canSend = useMemo(() => !loading && !!user, [loading, user]);

  const sendMessage = async (content) => {
    if (!user) return;
    const nextMessages = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, messages: nextMessages }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get response from AI.');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!user) return;
    setMessages([]);
    await fetch(`${API_URL}/api/history/${user.uid}`, { method: 'DELETE' });
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      <Navbar
        title={`AIRA-AI${user?.displayName ? ` • ${user.displayName}` : ''}`}
        onClear={clearChat}
        showLogout
        onLogout={async () => {
          await signOut(auth);
          navigate('/');
        }}
      />

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-5">
        {messages.length === 0 && !loading && (
          <p className="text-center text-sm text-zinc-500">Start your conversation with AIRA-AI.</p>
        )}
        {messages.map((msg, index) => (
          <MessageBubble key={`${msg.role}-${index}`} role={msg.role} content={msg.content} />
        ))}
        {loading && <Loader />}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div ref={endRef} />
      </section>

      <ChatInput onSend={sendMessage} disabled={!canSend} />
    </div>
  );
}
