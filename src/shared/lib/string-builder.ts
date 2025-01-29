const COATI_QUATI_NAMESPACE = 'coatiquati_';

type NamespacedName<T extends string, postfix extends string> = `${typeof COATI_QUATI_NAMESPACE}${T}_${postfix}`;

export function makeCookieName<T extends string>(name: T): NamespacedName<T, 'ck'> {
  return `${COATI_QUATI_NAMESPACE}${name}_ck`;
}

export function makeLocalStorageName<T extends string>(name: T): NamespacedName<T, 'ls'> {
  return `${COATI_QUATI_NAMESPACE}${name}_ls`;
}

