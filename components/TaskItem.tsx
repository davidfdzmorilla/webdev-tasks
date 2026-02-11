'use client';

import { Task } from '@/lib/db/schema';
import { toggleTaskStatus, deleteTask } from '@/app/actions/tasks';
import { useState } from 'react';

export default function TaskItem({ task }: { task: Task }) {
  const [loading, setLoading] = useState(false);

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const handleToggle = async () => {
    setLoading(true);
    await toggleTaskStatus(task.id, task.status);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    await deleteTask(task.id);
    setLoading(false);
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800">
      <div className="mb-2 flex items-start justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {task.description}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          disabled={loading}
          className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {task.status === 'todo' && 'Start'}
          {task.status === 'in_progress' && 'Complete'}
          {task.status === 'done' && 'Reopen'}
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
