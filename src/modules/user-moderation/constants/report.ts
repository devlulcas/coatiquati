export const REPORT_REASON = {
  notSafeForWork: 'not_safe_for_work',
  hateSpeech: 'hate_speech',
  harassmentOrBullying: 'harassment_or_bullying',
  spamOrUnsolicitedCommercialContent: 'spam_or_unsolicited_commercial_content',
  copyrightViolation: 'copyright_violation',
  falseOrMisleadingInformation: 'false_or_misleading_information',
  fraudulentOrSuspiciousActivity: 'fraudulent_or_suspicious_activity',
  dangerousOrThreateningBehavior: 'dangerous_or_threatening_behavior',
  privacyInvasion: 'privacy_invasion',
  violentOrGraphicContent: 'violent_or_graphic_content',
  useOfFakeAccountOrBot: 'use_of_fake_account_or_bot',
  platformPolicyViolation: 'platform_policy_violation',
} as const;

export const REPORT_REASONS = Object.values(REPORT_REASON);

export const isValidReportReason = (reason: string): reason is ReportReason => REPORT_REASONS.includes(reason as any);

export type ReportReason = (typeof REPORT_REASON)[keyof typeof REPORT_REASON];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  not_safe_for_work: 'Conteúdo não seguro para o trabalho',
  hate_speech: 'Discurso de ódio',
  harassment_or_bullying: 'Assédio ou bullying',
  spam_or_unsolicited_commercial_content: 'Spam ou conteúdo comercial não solicitado',
  copyright_violation: 'Violação de direitos autorais',
  dangerous_or_threatening_behavior: 'Comportamento perigoso ou ameaçador',
  false_or_misleading_information: 'Informação falsa ou enganosa',
  fraudulent_or_suspicious_activity: 'Atividade fraudulenta ou suspeita',
  platform_policy_violation: 'Violação de política da plataforma',
  privacy_invasion: 'Invasão de privacidade',
  use_of_fake_account_or_bot: 'Uso de conta falsa ou bot',
  violent_or_graphic_content: 'Conteúdo violento ou gráfico',
};

export const REPORT_ENTITY_TYPE = ['trail', 'topic', 'content', 'publication'] as const;
export type ReportEntityType = (typeof REPORT_ENTITY_TYPE)[number];
export const REPORT_ENTITY_TYPE_LABELS: Record<ReportEntityType, string> = {
  trail: 'Trilha',
  topic: 'Tópico',
  content: 'Conteúdo',
  publication: 'Publicação',
};
