export function saveText(filename: string, text: string) {
	const link = document.createElement('a');

	const file = new Blob([text], { type: 'text/plain' });

	link.href = URL.createObjectURL(file);
	link.download = filename;
	link.click();

	URL.revokeObjectURL(link.href);
}
