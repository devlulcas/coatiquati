export const sensibleOperation = {
  BAN: 'BAN',
  REMOVE_BAN: 'REMOVE_BAN',
  UPGRADE_TO_ADMIN: 'UPGRADE_TO_ADMIN',
  DOWNGRADE_FROM_ADMIN: 'DOWNGRADE_FROM_ADMIN',
};

export type SensibleOperation = (typeof sensibleOperation)[keyof typeof sensibleOperation];
