// app.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import('./modules/auth/services/lucia').Auth;

  type DatabaseUserAttributes = Omit<
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    import('./modules/database/schema/user').AuthUserTable,
    'id' | 'createdAt' | 'updatedAt' | 'isBanned' | 'verified' | 'deletedAt'
  > & {
    is_banned: number;
    email_verified: number;
    deleted_at: number | null;
  };

  type DatabaseSessionAttributes = {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    id: import('./modules/database/schema/user').AuthUserTable['id'];
  };
}
