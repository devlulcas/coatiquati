export type Ok<T> = {
  type: 'ok';
  value: T;
};

export type Fail = {
  type: 'fail';
  fail: string;
};

export type Result<T = void> = Ok<T> | Fail;

export function ok<T>(value: T): Ok<T> {
  return { type: 'ok', value };
}

export function fail(message: 'undefined' | (string & {})): Fail {
  return { type: 'fail', fail: message };
}

export function isFail<T>(result: Result<T>): result is { type: 'fail'; fail: string } {
  return result.type === 'fail' && result.fail !== 'undefined';
}

export function isOk<T>(result: Result<T>): result is { type: 'ok'; value: T } {
  return result.type === 'ok';
}

export function unwrap<T>(result: Result<T>): T {
  if (isFail(result)) {
    throw result.fail;
  }

  return result.value;
}

export function unwrapOr<T>(result: Result<T>, defaultValue: T): T {
  if (isFail(result)) {
    return defaultValue;
  }

  return result.value;
}

export async function wrapAsyncInResult<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const value = await promise;
    return ok(value);
  } catch (e) {
    if (e instanceof Error) {
      return fail(e.message);
    } else {
      return fail('Erro desconhecido');
    }
  }
}

export function wrapInResult<T>(fn: () => T): Result<T> {
  try {
    return ok(fn());
  } catch (e) {
    if (e instanceof Error) {
      return fail(e.message);
    } else {
      return fail('Erro desconhecido');
    }
  }
}
