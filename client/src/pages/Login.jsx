import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const providerVerified = result.user.providerData.some((item) => item.providerId === 'google.com');
      if (result.user.emailVerified || providerVerified) {
        navigate('/chat');
      } else {
        alert('Please verify your email before continuing.');
      }
    } catch (error) {
      alert(error.message || 'Failed to sign in with Google.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <h1 className="mb-2 text-2xl font-bold">Welcome to AIRA-AI</h1>
        <p className="mb-8 text-sm text-zinc-400">Login to save your chat history, or continue as guest.</p>

        <button
          onClick={handleGoogleLogin}
          className="mb-3 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-zinc-950 hover:bg-cyan-400"
        >
          Continue with Google
        </button>

        <button
          onClick={() => navigate('/guest')}
          className="w-full rounded-xl border border-zinc-700 px-4 py-3 font-semibold text-zinc-200 hover:border-zinc-500"
        >
          Try without login
        </button>
      </section>
    </main>
  );
}
