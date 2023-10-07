export type Creatable<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type Updatable<T> = Partial<Creatable<T>> & {
  id: T extends { id: infer U } ? U : never;
};
