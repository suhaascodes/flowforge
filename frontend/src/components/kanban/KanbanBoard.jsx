import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useMemo, useRef, useState } from 'react';
import KanbanColumn from './KanbanColumn';
import KanbanTaskCard from './KanbanTaskCard';

function getOverStatus(overId, tasksByColumn) {
  if (!overId) {
    return null;
  }

  if (String(overId).startsWith('column-')) {
    return String(overId).replace('column-', '');
  }

  const status = Object.keys(tasksByColumn).find((key) => tasksByColumn[key].some((task) => task.id === overId));
  return status || null;
}

function getTaskIndex(status, taskId, tasksByColumn) {
  return (tasksByColumn[status] || []).findIndex((task) => task.id === taskId);
}

export default function KanbanBoard({
  columnOrder,
  tasksByColumn,
  loading,
  pendingStatusUpdates,
  findTaskStatus,
  getTaskById,
  reorderWithinColumn,
  moveTaskLocally,
  persistTaskStatus,
  onOpenDetail,
  canManageTasks = false,
}) {
  const [activeTaskId, setActiveTaskId] = useState(null);
  const dragOriginStatusRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const activeTask = useMemo(() => (activeTaskId ? getTaskById(activeTaskId) : null), [activeTaskId, getTaskById]);

  const handleDragStart = (event) => {
    if (!canManageTasks) {
      return;
    }

    const taskId = event?.active?.id;

    if (!taskId) {
      return;
    }

    setActiveTaskId(taskId);
    dragOriginStatusRef.current = findTaskStatus(taskId);
  };

  const handleDragEnd = async (event) => {
    if (!canManageTasks) {
      return;
    }

    const activeId = event?.active?.id;
    const overId = event?.over?.id;

    setActiveTaskId(null);

    if (!activeId || !overId) {
      dragOriginStatusRef.current = null;
      return;
    }

    const sourceStatus = dragOriginStatusRef.current || findTaskStatus(activeId);
    const targetStatus = getOverStatus(overId, tasksByColumn);

    if (!sourceStatus || !targetStatus) {
      dragOriginStatusRef.current = null;
      return;
    }

    if (sourceStatus === targetStatus && activeId !== overId) {
      reorderWithinColumn(sourceStatus, activeId, overId);
      dragOriginStatusRef.current = null;
      return;
    }

    if (sourceStatus !== targetStatus) {
      const targetIndex = String(overId).startsWith('column-') ? null : getTaskIndex(targetStatus, overId, tasksByColumn);
      const previousColumns = moveTaskLocally(activeId, targetStatus, targetIndex);
      await persistTaskStatus(activeId, targetStatus, sourceStatus, previousColumns);
    }

    dragOriginStatusRef.current = null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section className="kanban-scrollbar -mx-1 flex min-h-[560px] gap-3 overflow-x-auto px-1 pb-1 lg:gap-4">
        {columnOrder.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByColumn[status] || []}
            loading={loading}
            pendingStatusUpdates={pendingStatusUpdates}
            onOpenDetail={onOpenDetail}
            canManageTasks={canManageTasks}
          />
        ))}
      </section>

      <DragOverlay dropAnimation={{ duration: 180, easing: 'ease-out' }}>
        {canManageTasks && activeTask ? (
          <div className="rotate-2 scale-[1.02] shadow-[0_24px_70px_rgba(2,6,23,0.65)]">
            <KanbanTaskCard task={activeTask} pending={false} onOpenDetail={() => {}} canManageTasks={canManageTasks} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
