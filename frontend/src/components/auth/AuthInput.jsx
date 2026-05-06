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
      <label htmlFor={id} className="block text-[13px] font-medium tracking-[0.01em] text-slate-100">
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
        className={`w-full rounded-2xl border bg-white/[0.04] px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-rose-400/70' : 'border-white/15'
        }`}
      />
      {error ? <p className="text-xs leading-5 text-rose-200">{error}</p> : null}
    </div>
  );
}