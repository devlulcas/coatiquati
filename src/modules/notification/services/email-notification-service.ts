import type { NotificationService } from '../types/notification-service';

export class EmailNotificationService implements NotificationService {
  constructor(private to: string) {}

  async send(message: string): Promise<void> {
    // Lógica para enviar um e-mail
    console.log(`Enviando e-mail para ${this.to}: ${message}`);
  }
}
