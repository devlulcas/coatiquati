export function formDataToObject(formData: FormData) {
	const entries = formData.entries();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data: Record<string, any> = {};

	for (const [key, value] of entries) {
		data[key] = value;
	}

	return data;
}
