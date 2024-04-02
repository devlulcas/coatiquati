export type WithId<T, ID extends string | number = number> = T & { id: ID };
export type With<T, K extends string | number, V> = T & { [P in K]: V };
export type WithOptionalID<T, ID extends string | number = number> = T & { id?: ID };
