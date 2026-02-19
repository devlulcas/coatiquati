import { ReportReason } from '@/modules/database/lib/report-enum';

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  [ReportReason.NOT_SAFE_FOR_WORK]: 'Conteúdo não seguro para o trabalho',
  [ReportReason.HATE_SPEECH]: 'Discurso de ódio',
  [ReportReason.HARASSMENT_OR_BULLYING]: 'Assédio ou bullying',
  [ReportReason.SPAM_OR_UNSOLICITED_COMMERCIAL_CONTENT]: 'Spam ou conteúdo comercial não solicitado',
  [ReportReason.COPYRIGHT_VIOLATION]: 'Violação de direitos autorais',
  [ReportReason.FALSE_OR_MISLEADING_INFORMATION]: 'Informação falsa ou enganosa',
  [ReportReason.FRAUDULENT_OR_SUSPICIOUS_ACTIVITY]: 'Atividade fraudulenta ou suspeita',
  [ReportReason.DANGEROUS_OR_THREATENING_BEHAVIOR]: 'Comportamento perigoso ou ameaçador',
  [ReportReason.PRIVACY_INVASION]: 'Invasão de privacidade',
  [ReportReason.VIOLENT_OR_GRAPHIC_CONTENT]: 'Conteúdo violento ou gráfico',
  [ReportReason.USE_OF_FAKE_ACCOUNT_OR_BOT]: 'Uso de conta falsa ou bot',
  [ReportReason.PLATFORM_POLICY_VIOLATION]: 'Violação de política da plataforma',
};
