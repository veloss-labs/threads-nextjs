import { remember } from '@epic-web/remember';

import { env } from '~/app/env';

interface Task {
  fn: () => Promise<void>;
  priority: number;
  id: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  attempts: number;
}

export class BackgroundTaskManager {
  private tasks = new Map<number, Task>();
  private isRunning = false;
  private taskId = 0;

  private retries = new Map<number, ReturnType<typeof setTimeout>>();
  private intervals = new Map<number, ReturnType<typeof setInterval>>();
  private timeouts = new Map<number, ReturnType<typeof setTimeout>>();

  registerTask(fn: () => Promise<void>, priority = 0) {
    const task = {
      fn,
      priority,
      id: this.taskId++,
      status: 'pending' as const,
      attempts: 0,
    };
    this.tasks.set(task.id, task);

    this.runTasks();
  }

  scheduleTask(fn: () => Promise<void>, priority = 0, interval = 3600000) {
    // interval is in milliseconds
    this.registerTask(fn, priority);
    const taskInterval = setInterval(() => {
      this.registerTask(fn, priority);
    }, interval);
    this.intervals.set(this.taskId, taskInterval);
  }

  delayTask(fn: () => Promise<void>, priority = 0, delay = 1000) {
    // delay is in milliseconds
    const taskTimeout = setTimeout(() => {
      this.registerTask(fn, priority);
    }, delay);
    this.timeouts.set(this.taskId, taskTimeout);
  }

  cancelTask(id: number) {
    this.tasks.delete(id);
  }

  cancelScheduledTask(id: number) {
    const taskInterval = this.intervals.get(id);
    if (taskInterval) {
      clearInterval(taskInterval);
      this.intervals.delete(id);
    }
  }

  cancelDelayedTask(id: number) {
    const taskTimeout = this.timeouts.get(id);
    if (taskTimeout) {
      clearTimeout(taskTimeout);
      this.timeouts.delete(id);
    }
  }

  getTaskStatus(
    id: number,
  ): 'pending' | 'running' | 'completed' | 'failed' | 'not found' {
    const task = this.tasks.get(id);
    return task ? task.status : 'not found';
  }

  private async runTasks() {
    if (this.isRunning) return;
    this.isRunning = true;

    while (this.tasks.size > 0) {
      const task = Array.from(this.tasks.values()).shift();
      if (!task) {
        continue;
      }

      if (this.retries.has(task.id)) {
        clearTimeout(this.retries.get(task.id));
        this.retries.delete(task.id);
      }

      try {
        task.status = 'running';
        await task.fn();
        task.status = 'completed';
      } catch (error) {
        console.error(`Task ${task.id} failed with error:`, error);
        task.status = 'failed';

        // Exponential backoff for task retry
        const delay = Math.pow(2, task.attempts++) * 1000;
        const timeoutId = setTimeout(
          () => this.tasks.set(task.id, task),
          delay,
        );

        this.retries.set(task.id, timeoutId);

        // 재시도 로직
        this.runTasks();
      }

      if (task.status === 'completed' || task.status === 'failed') {
        this.tasks.delete(task.id);
      }
    }

    this.isRunning = false;
  }
}

export const taskRunner =
  env.NODE_ENV === 'development'
    ? new BackgroundTaskManager()
    : remember('taskRunner', () => new BackgroundTaskManager());
