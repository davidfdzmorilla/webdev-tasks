'use client';

import { Task } from '@/lib/db/schema';
import TaskItem from './TaskItem';

export default function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">
          No tasks yet. Create your first task above!
        </p>
      </div>
    );
  }

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          To Do
          <span className="ml-2 rounded-full bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">
            {todoTasks.length}
          </span>
        </h3>
        <div className="space-y-3">
          {todoTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          In Progress
          <span className="ml-2 rounded-full bg-blue-200 px-2 py-1 text-xs dark:bg-blue-900">
            {inProgressTasks.length}
          </span>
        </h3>
        <div className="space-y-3">
          {inProgressTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Done
          <span className="ml-2 rounded-full bg-green-200 px-2 py-1 text-xs dark:bg-green-900">
            {doneTasks.length}
          </span>
        </h3>
        <div className="space-y-3">
          {doneTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}
