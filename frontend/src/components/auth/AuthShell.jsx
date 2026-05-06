import { motion } from 'framer-motion';

export default function AuthShell({ children, title, subtitle }) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.16),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.12),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-center lg:gap-10"
      >
        <section className="w-full lg:w-[48%]">
          <div className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100/90">
            FlowForge Auth
          </div>
          <h1 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">{subtitle}</p>
        </section>

        <section className="w-full lg:w-[52%]">{children}</section>
      </motion.div>
    </div>
  );
}