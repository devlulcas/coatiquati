export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPreview = Omit<User, 'password'>;

export type CreatableUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatableUser = Partial<Omit<User, 'createdAt' | 'updatedAt'>>;
