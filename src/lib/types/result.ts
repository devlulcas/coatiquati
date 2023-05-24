export type ResultType<T> =
	| {
			data: T;
			error: null;
	  }
	| {
			data: null;
			error: Error;
	  };

export const Ok = <T>(data: T): ResultType<T> => ({
	data,
	error: null
});

export const Fail = <T>(error: Error |  string): ResultType<T> => ({
	data: null,
	error: error instanceof Error ? error : new Error(error)
});
