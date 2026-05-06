import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../components/dashboard/StatCard';
import RecentActivitySection from '../components/dashboard/RecentActivitySection';
import AssignedTasksSection from '../components/dashboard/AssignedTasksSection';
import TeamOverviewSection from '../components/dashboard/TeamOverviewSection';
import QuickActionsSection from '../components/dashboard/QuickActionsSection';
import {
  dashboardStats,
  recentActivities,
  assignedTasks,
  teamOverview,
  quickActions,
} from '../data/dashboardMock';

export default function DashboardHomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 820);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-5 sm:space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-panel-strong rounded-[1.5rem] p-4 sm:p-6"
      >
        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/90">Dashboard Overview</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
          Build momentum without context switching.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
          This shell is optimized for rapid expansion into kanban, analytics, task operations, and settings modules while
          keeping interaction patterns consistent.
        </p>
      </motion.section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <StatCard item={item} loading={loading} />
          </motion.div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivitySection activities={recentActivities} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <AssignedTasksSection tasks={assignedTasks} loading={loading} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TeamOverviewSection members={teamOverview} loading={loading} />
        </div>
        <div className="lg:col-span-3">
          <QuickActionsSection actions={quickActions} loading={loading} />
        </div>
      </section>
    </div>
  );
}
