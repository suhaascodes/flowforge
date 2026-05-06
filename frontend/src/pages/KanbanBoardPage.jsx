import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskCreateModal from '../components/kanban/TaskCreateModal';
import TaskDetailModal from '../components/kanban/TaskDetailModal';
import useKanbanBoard from '../hooks/useKanbanBoard';
import { useAuth } from '../context/AuthContext';

export default function KanbanBoardPage() {
  const { user } = useAuth();
  const {
    columnOrder,
    tasksByColumn,
    taskCount,
    users,
    loading,
    error,
    savingTask,
    pendingStatusUpdates,
    loadBoard,
    getTaskById,
    findTaskStatus,
    reorderWithinColumn,
    moveTaskLocally,
    persistTaskStatus,
    updateTaskStatusOptimistic,
    createTaskOptimistic,
  } = useKanbanBoard();

  const [createOpen, setCreateOpen] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState(null);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  const detailTask = useMemo(() => getTaskById(detailTaskId), [detailTaskId, getTaskById]);

  const handleCreate = async (formData) => {
    await createTaskOptimistic(formData, user);
  };

  const handleStatusMoveFromModal = async (taskId, status) => {
    try {
      setDetailError('');
      await updateTaskStatusOptimistic(taskId, status);
    } catch (moveError) {
      setDetailError(moveError?.message || 'Unable to move task.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-300/10 via-blue-400/10 to-violet-300/10 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Kanban Workspace</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Manage sprint flow with drag and momentum.</h2>
          <p className="mt-2 text-sm text-slate-300">{taskCount} tasks across 6 delivery stages.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-3.5 py-2 text-sm font-semibold text-slate-900 hover:brightness-110"
        >
          <FiPlus className="h-4 w-4" />
          New Task
        </button>
      </motion.section>

      {error ? (
        <div className="rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{error}</div>
      ) : null}

      <KanbanBoard
        columnOrder={columnOrder}
        tasksByColumn={tasksByColumn}
        loading={loading}
        pendingStatusUpdates={pendingStatusUpdates}
        findTaskStatus={findTaskStatus}
        getTaskById={getTaskById}
        reorderWithinColumn={reorderWithinColumn}
        moveTaskLocally={moveTaskLocally}
        persistTaskStatus={persistTaskStatus}
        onOpenDetail={setDetailTaskId}
      />

      <TaskCreateModal
        open={createOpen}
        users={users}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isSaving={savingTask}
      />

      <TaskDetailModal
        open={Boolean(detailTask)}
        task={detailTask}
        onClose={() => {
          setDetailTaskId(null);
          setDetailError('');
        }}
        onMoveStatus={handleStatusMoveFromModal}
        isSaving={Boolean(detailTask && pendingStatusUpdates[detailTask.id])}
      />

      {detailError ? (
        <div className="rounded-xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{detailError}</div>
      ) : null}
    </div>
  );
}
