import { notification } from './store.js';

type NotificationTypes = 'default' | 'danger' | 'warning' | 'info' | 'success';

type NotificationOptions = {
  timeout?: number;
  persist?: boolean;
};

export function send(
  message: string,
  type: NotificationTypes = 'default',
  options?: NotificationOptions,
): void {
  notification.set({ type, message, options });
}

export function dangerNotifier(message: string, options?: NotificationOptions): void {
  send(message, 'danger', options);
}

export function warningNotifier(message: string, options?: NotificationOptions): void {
  send(message, 'warning', options);
}

export function infoNotifier(message: string, options?: NotificationOptions): void {
  send(message, 'info', options);
}

export function successNotifier(message: string, options?: NotificationOptions): void {
  send(message, 'success', options);
}
