export default function AuthButton({ children, loading = false, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-900/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}