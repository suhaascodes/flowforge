export default function AuthFormError({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
      {message}
    </div>
  );
}