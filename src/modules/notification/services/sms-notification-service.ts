import type { NotificationService } from '../types/notification-service';

export class SMSNotificationService implements NotificationService {
  constructor(private phoneNumber: string) {}

  async send(message: string): Promise<void> {
    // Lógica para enviar SMS
    console.log(`Enviando SMS para ${this.phoneNumber}: ${message}`);
  }
}
