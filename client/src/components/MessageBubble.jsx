export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm shadow-md sm:max-w-[75%] ${
          isUser
            ? 'rounded-br-sm bg-cyan-500/90 text-white'
            : 'rounded-bl-sm bg-zinc-800 text-zinc-100'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
