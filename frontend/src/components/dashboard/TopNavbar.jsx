import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBell, FiChevronDown, FiLogOut, FiMenu, FiSearch } from 'react-icons/fi';

function initialsFromName(name) {
  if (!name) {
    return 'U';
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function TopNavbar({ pageTitle, user, logout, onOpenMobileNav }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const initials = useMemo(() => initialsFromName(user?.name), [user?.name]);

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#070b14]/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 items-center gap-3 px-4 sm:h-18 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 lg:hidden"
          aria-label="Open mobile navigation"
        >
          <FiMenu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/85">Workspace</p>
          <h1 className="truncate text-sm font-semibold tracking-[-0.02em] text-white sm:text-base">{pageTitle}</h1>
        </div>

        <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
          <label className="hidden min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-slate-300 transition focus-within:border-cyan-300/40 focus-within:ring-2 focus-within:ring-cyan-300/15 md:flex md:w-[280px] lg:w-[340px]">
            <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects, tasks, teammates..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
          </label>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
            aria-label="Notifications"
          >
            <FiBell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-300" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-left text-slate-200 transition hover:bg-white/10"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-300/15 text-xs font-semibold text-cyan-100 ring-1 ring-cyan-300/20">
                {initials}
              </span>
              <span className="hidden max-w-[130px] truncate text-sm sm:inline">{user?.name || 'User'}</span>
              <FiChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {profileOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#111827]/95 p-2.5 shadow-[0_22px_55px_rgba(2,6,23,0.55)] backdrop-blur-xl"
                >
                  <div className="border-b border-white/10 px-2 pb-2.5">
                    <p className="truncate text-sm font-medium text-slate-100">{user?.name}</p>
                    <p className="truncate text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-2 inline-flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-rose-100 transition hover:bg-rose-500/15"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}