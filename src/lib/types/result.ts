export type FieldError = Record<string, string[] | undefined> | null;

const errorCodes = {
	badRequest: 400,
	notAuthorized: 401,
	forbidden: 403,
	notFound: 404,
	notAcceptable: 406,
	requestTimeout: 408,
	conflict: 409,
	gone: 410,
	lengthRequired: 411,
	preconditionFailed: 412,
	payloadTooLarge: 413,
	unsupportedMediaType: 415,
	expectationFailed: 417,
	teapot: 418,
	enhanceYourCalm: 420,
	tokenExpired: 422,
	tooManyRequests: 429,
	internalServerError: 500,
	notImplemented: 501
};

type ErrorType = keyof typeof errorCodes;

export type AppError = {
	message: string;
	type?: ErrorType;
	fieldErrors?: FieldError;
};

export type ResultType<T> =
	| {
			data: T;
			error: null;
	  }
	| {
			data: null;
			error: AppError;
	  };

export const Ok = <T>(data: T): ResultType<T> => ({
	data,
	error: null
});

export const Fail = <T>(error: AppError | Error | string): ResultType<T> => ({
	data: null,
	error:
		error instanceof Error
			? { message: error.message, type: 'internalServerError' }
			: typeof error === 'string'
			? { message: error, type: 'internalServerError' }
			: error
});
