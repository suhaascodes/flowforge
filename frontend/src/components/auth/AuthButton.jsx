export default function AuthButton({ children, loading = false, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_30px_rgba(14,165,233,0.22)] transition hover:-translate-y-[1px] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
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