import { useCallback, useMemo, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { KANBAN_COLUMN_ORDER } from '../constants/kanban';
import { TASK_STATUSES } from '../constants';
import {
  buildBoardState,
  buildTaskCreatePayload,
  createKanbanTask,
  deleteKanbanTask,
  fetchKanbanBootstrap,
  moveTaskStatus,
} from '../services/kanbanService';

function cloneColumns(columns) {
  return Object.fromEntries(Object.entries(columns).map(([key, ids]) => [key, [...ids]]));
}

export default function useKanbanBoard() {
  const [tasksById, setTasksById] = useState({});
  const [columnTaskIds, setColumnTaskIds] = useState(() =>
    KANBAN_COLUMN_ORDER.reduce((acc, status) => {
      acc[status] = [];
      return acc;
    }, {}),
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingTask, setSavingTask] = useState(false);
  const [deletingTaskIds, setDeletingTaskIds] = useState({});
  const [pendingStatusUpdates, setPendingStatusUpdates] = useState({});

  const loadBoard = useCallback(async (currentUser) => {
    try {
      setLoading(true);
      setError('');
      const bootstrap = await fetchKanbanBootstrap(currentUser);
      const nextState = buildBoardState(bootstrap.tasks);

      setTasksById(nextState.tasksById);
      setColumnTaskIds(nextState.columnTaskIds);
      setUsers(bootstrap.users);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load board data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const tasksByColumn = useMemo(
    () =>
      KANBAN_COLUMN_ORDER.reduce((acc, status) => {
        acc[status] = (columnTaskIds[status] || []).map((id) => tasksById[id]).filter(Boolean);
        return acc;
      }, {}),
    [columnTaskIds, tasksById],
  );

  const taskCount = useMemo(() => Object.keys(tasksById).length, [tasksById]);

  const getTaskById = useCallback((taskId) => tasksById[taskId] || null, [tasksById]);

  const findTaskStatus = useCallback(
    (taskId) => KANBAN_COLUMN_ORDER.find((status) => (columnTaskIds[status] || []).includes(taskId)) || null,
    [columnTaskIds],
  );

  const reorderWithinColumn = useCallback((status, activeId, overId) => {
    if (!status || !activeId || !overId || activeId === overId) {
      return;
    }

    setColumnTaskIds((prev) => {
      const currentIds = prev[status] || [];
      const oldIndex = currentIds.indexOf(activeId);
      const newIndex = currentIds.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1) {
        return prev;
      }

      return {
        ...prev,
        [status]: arrayMove(currentIds, oldIndex, newIndex),
      };
    });
  }, []);

  const moveTaskLocally = useCallback((taskId, targetStatus, targetIndex = null) => {
    let previousColumns = null;

    setColumnTaskIds((prev) => {
      previousColumns = cloneColumns(prev);
      const next = cloneColumns(prev);

      Object.keys(next).forEach((status) => {
        next[status] = next[status].filter((id) => id !== taskId);
      });

      const destination = [...(next[targetStatus] || [])];
      const index = targetIndex === null || targetIndex > destination.length ? destination.length : targetIndex;
      destination.splice(index, 0, taskId);
      next[targetStatus] = destination;

      return next;
    });

    setTasksById((prev) => {
      const existing = prev[taskId];
      if (!existing) {
        return prev;
      }

      return {
        ...prev,
        [taskId]: {
          ...existing,
          status: targetStatus,
        },
      };
    });

    return previousColumns;
  }, []);

  const rollbackMove = useCallback((taskId, previousStatus, previousColumns) => {
    if (!previousColumns) {
      return;
    }

    setColumnTaskIds(previousColumns);
    setTasksById((prev) => {
      const existing = prev[taskId];
      if (!existing) {
        return prev;
      }

      return {
        ...prev,
        [taskId]: {
          ...existing,
          status: previousStatus,
        },
      };
    });
  }, []);

  const persistTaskStatus = useCallback(
    async (taskId, targetStatus, previousStatus, previousColumns) => {
      try {
        setPendingStatusUpdates((prev) => ({ ...prev, [taskId]: true }));
        const updatedTask = await moveTaskStatus(taskId, targetStatus);

        setTasksById((prev) => ({
          ...prev,
          [taskId]: {
            ...prev[taskId],
            ...updatedTask,
          },
        }));
      } catch (_error) {
        rollbackMove(taskId, previousStatus, previousColumns);
        throw new Error('Task status update failed.');
      } finally {
        setPendingStatusUpdates((prev) => {
          const next = { ...prev };
          delete next[taskId];
          return next;
        });
      }
    },
    [rollbackMove],
  );

  const updateTaskStatusOptimistic = useCallback(
    async (taskId, targetStatus) => {
      const previousStatus = findTaskStatus(taskId);

      if (!previousStatus || previousStatus === targetStatus) {
        return;
      }

      const previousColumns = moveTaskLocally(taskId, targetStatus);
      await persistTaskStatus(taskId, targetStatus, previousStatus, previousColumns);
    },
    [findTaskStatus, moveTaskLocally, persistTaskStatus],
  );

  const createTaskOptimistic = useCallback(
    async (formData, currentUser) => {
      const payload = buildTaskCreatePayload(formData);
      const tempId = `temp-${Date.now()}`;
      const optimisticTask = {
        id: tempId,
        title: payload.title,
        description: payload.description,
        status: payload.status || TASK_STATUSES.BACKLOG,
        priority: payload.priority,
        assignedTo: users.find((user) => user.id === payload.assignedTo) || null,
        createdBy: currentUser
          ? {
              id: currentUser.id || currentUser._id,
              name: currentUser.name,
              email: currentUser.email,
              avatar: currentUser.avatar,
            }
          : null,
        dueDate: payload.dueDate,
        tags: payload.tags,
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSavingTask(true);
      setTasksById((prev) => ({ ...prev, [tempId]: optimisticTask }));
      setColumnTaskIds((prev) => ({
        ...prev,
        [optimisticTask.status]: [tempId, ...(prev[optimisticTask.status] || [])],
      }));

      try {
        const createdTask = await createKanbanTask(payload);

        setTasksById((prev) => {
          const next = { ...prev };
          delete next[tempId];
          next[createdTask.id] = createdTask;
          return next;
        });

        setColumnTaskIds((prev) => {
          const next = cloneColumns(prev);
          next[optimisticTask.status] = next[optimisticTask.status].filter((id) => id !== tempId);
          next[createdTask.status] = [createdTask.id, ...(next[createdTask.status] || [])];
          return next;
        });
      } catch (createError) {
        setTasksById((prev) => {
          const next = { ...prev };
          delete next[tempId];
          return next;
        });
        setColumnTaskIds((prev) => ({
          ...prev,
          [optimisticTask.status]: (prev[optimisticTask.status] || []).filter((id) => id !== tempId),
        }));
        throw createError;
      } finally {
        setSavingTask(false);
      }
    },
    [users],
  );

  const deleteTaskOptimistic = useCallback(async (taskId) => {
    const previousTask = tasksById[taskId];
    const previousStatus = findTaskStatus(taskId);

    if (!previousTask || !previousStatus) {
      return;
    }

    setDeletingTaskIds((prev) => ({ ...prev, [taskId]: true }));
    setTasksById((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
    setColumnTaskIds((prev) => ({
      ...prev,
      [previousStatus]: (prev[previousStatus] || []).filter((id) => id !== taskId),
    }));

    try {
      await deleteKanbanTask(taskId);
    } catch (deleteError) {
      setTasksById((prev) => ({ ...prev, [taskId]: previousTask }));
      setColumnTaskIds((prev) => ({
        ...prev,
        [previousStatus]: [taskId, ...(prev[previousStatus] || [])],
      }));
      throw deleteError;
    } finally {
      setDeletingTaskIds((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
    }
  }, [findTaskStatus, tasksById]);

  return {
    columnOrder: KANBAN_COLUMN_ORDER,
    tasksByColumn,
    taskCount,
    users,
    loading,
    error,
    savingTask,
    deletingTaskIds,
    pendingStatusUpdates,
    loadBoard,
    getTaskById,
    findTaskStatus,
    reorderWithinColumn,
    moveTaskLocally,
    persistTaskStatus,
    updateTaskStatusOptimistic,
    createTaskOptimistic,
    deleteTaskOptimistic,
  };
}
