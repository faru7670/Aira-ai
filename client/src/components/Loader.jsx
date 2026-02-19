export default function Loader() {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
      <span>Thinking…</span>
    </div>
  );
}
