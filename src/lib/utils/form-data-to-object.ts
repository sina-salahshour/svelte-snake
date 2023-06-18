export function formDataToObject<T extends { parse: (args: unknown) => void; _type: unknown }>(
	fd: FormData,
	schema: T
): T['_type'] {
	return schema.parse(Object.fromEntries(fd));
}
