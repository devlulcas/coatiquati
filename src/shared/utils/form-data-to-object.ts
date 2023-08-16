export function formDataToObject(formData: FormData) {
  const object: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    object[key] = value;
  }

  return object;
}
