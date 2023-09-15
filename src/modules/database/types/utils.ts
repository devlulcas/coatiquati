export type Creatable<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type Updatable<T> = Partial<Omit<T, 'createdAt'>> & {
  id: T extends { id: infer U } ? U : never;
  updatedAt: string;
};
