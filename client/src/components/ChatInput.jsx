import { useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (!prompt.trim() || disabled) return;
    onSend(prompt.trim());
    setPrompt('');
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-950/95 p-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Type your message..."
          rows={2}
          className="min-h-[52px] flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-cyan-400"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
