export type NotificationService = {
  send: (message: string) => void | Promise<void>;
};
