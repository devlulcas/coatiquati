export type Result<T = void> =
  | {
      type: 'ok';
      value: T;
    }
  | {
      type: 'fail';
      fail: string;
    };

export function ok<T>(value: T): Result<T> {
  return { type: 'ok', value };
}

export function fail<T>(message: string): Result<T> {
  return { type: 'fail', fail: message };
}

export function isFail<T>(result: Result<T>): result is { type: 'fail'; fail: string } {
  return result.type === 'fail';
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
