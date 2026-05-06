export default function AuthFormError({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3.5 py-3 text-sm leading-6 text-rose-100">
      {message}
    </div>
  );
}