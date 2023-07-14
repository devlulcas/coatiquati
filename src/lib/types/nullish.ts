/**
 * @example
 *
 * type User = {
 *   name: string;
 *   age: number;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * };
 *
 * type NullishUser = Nullish<User>;
 * // ^
 * // {
 * //   name?: string | null | undefined;
 * //   age?: number | null | undefined;
 * //   address?: {
 * //     street?: string | null | undefined;
 * //     city?: string | null | undefined;
 * //   };
 * // }
 */
export type Nullish<T> = T extends Record<string, unknown> ? { [P in keyof T]?: Nullish<T[P]> } : T | null | undefined;
