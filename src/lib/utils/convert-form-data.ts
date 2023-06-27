export function formDataToObject(formData: FormData) {
	const entries = formData.entries();

	const data: Record<string, any> = {};

	for (const [key, value] of entries) {
		data[key] = value;
	}

	return data;
}
