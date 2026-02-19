export default function Navbar({ title = 'AIRA-AI', onClear, onLogout, showLogout = false }) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">{title}</h1>
          <p className="text-xs text-zinc-400">Fast, secure AI chat powered by OpenRouter</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-200 hover:border-zinc-500"
          >
            Clear chat
          </button>
          {showLogout && (
            <button
              onClick={onLogout}
              className="rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
