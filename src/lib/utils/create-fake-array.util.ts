export function create_fake_array(length: number) {
	return Array(length)
		.fill(0)
		.map((_, index) => index);
}
