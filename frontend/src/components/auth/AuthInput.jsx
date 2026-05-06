export default function AuthInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  disabled = false,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-100">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`w-full rounded-xl border bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-50 placeholder:text-slate-400 focus:border-cyan-300/70 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-rose-400/70' : 'border-white/15'
        }`}
      />
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}