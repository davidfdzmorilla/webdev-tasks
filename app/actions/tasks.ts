'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { tasks, type NewTask } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function createTask(data: NewTask) {
  await db.insert(tasks).values(data);
  revalidatePath('/dashboard');
}

export async function updateTask(id: string, data: Partial<NewTask>) {
  await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id));
  revalidatePath('/dashboard');
}

export async function deleteTask(id: string) {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath('/dashboard');
}

export async function toggleTaskStatus(id: string, currentStatus: string) {
  const newStatus =
    currentStatus === 'done'
      ? 'todo'
      : currentStatus === 'todo'
        ? 'in_progress'
        : 'done';

  await db
    .update(tasks)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(tasks.id, id));
  revalidatePath('/dashboard');
}
