export function slugify(str: string): string {
	return encodeURI(
		str
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/--+/g, '-')
	);
}
