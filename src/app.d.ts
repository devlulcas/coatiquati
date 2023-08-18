// app.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./modules/auth/services/lucia').Auth;
  type DatabaseUserAttributes = Omit<
    import('./modules/database/schema/user').AuthUserTable,
    'id' | 'createdAt' | 'updatedAt' | 'email_verified' | 'avatar'
  >;
  type DatabaseSessionAttributes = {
    id: import('./modules/database/schema/user').AuthUserTable['id'];
  };
}
