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
 * type UserOptional = Optional<User>;
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
export type Optional<T> = T extends Record<string, unknown>
	? { [P in keyof T]?: Optional<T[P]> }
	: T | null | undefined;
