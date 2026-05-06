import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FiChevronLeft, FiMenu, FiX } from 'react-icons/fi';
import { sidebarItems } from '../../data/dashboardMock';

function SidebarContent({ isCollapsed, setIsCollapsed, onNavigate }) {
  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-[#0b1220]/95 px-3 py-4 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between px-2">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300/80">FlowForge</p>
          {!isCollapsed ? <p className="mt-1 text-sm font-semibold text-white">Operations Hub</p> : null}
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden rounded-lg border border-white/15 bg-white/5 p-1.5 text-slate-300 transition hover:bg-white/10 lg:inline-flex"
          aria-label="Collapse sidebar"
        >
          <FiChevronLeft className={`h-4 w-4 transition ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group relative flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition ${
                  isActive
                    ? 'bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-slate-100'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed ? <span className="truncate">{item.label}</span> : null}
            </NavLink>
          );
        })}
      </nav>

      {!isCollapsed ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-medium text-slate-200">Scale Ready</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Shell prepared for kanban, analytics, task pages, and settings modules.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function AppSidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      <aside
        className={`relative z-20 hidden transition-all duration-300 lg:block ${
          isCollapsed ? 'w-[84px]' : 'w-[260px]'
        }`}
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onNavigate={undefined}
        />
      </aside>

      <AnimatePresence>
        {isMobileOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
              aria-label="Close sidebar overlay"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="fixed left-0 top-0 z-40 h-screen w-[264px] lg:hidden"
            >
              <div className="absolute right-3 top-3">
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-lg border border-white/20 bg-white/10 p-1.5 text-slate-200"
                  aria-label="Close mobile sidebar"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
              <SidebarContent
                isCollapsed={false}
                setIsCollapsed={setIsCollapsed}
                onNavigate={() => setIsMobileOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-4 right-4 z-20 inline-flex rounded-full border border-white/20 bg-cyan-300 p-3 text-slate-950 shadow-lg shadow-cyan-900/40 lg:hidden"
        aria-label="Open mobile navigation"
      >
        <FiMenu className="h-5 w-5" />
      </button>
    </>
  );
}
