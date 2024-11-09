/**
 * Splits an array into multiple smaller arrays of a specified size.
 *
 * @param array - The array to be split into chunks.
 * @param size - The maximum size of each chunk.
 * @returns An array containing the chunked arrays.
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];

	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}

	return chunks;
}

/**
 * Processes an array of items in chunks, asynchronously applying a provided function to each chunk.
 *
 * @param items - The array of items to be processed.
 * @param chunkSize - The maximum size of each chunk.
 * @param processFn - An asynchronous function that processes a chunk of items.
 */
export async function processInChunks<T>(
	items: T[],
	chunkSize: number,
	processFn: (chunk: T[]) => Promise<void>
) {
	const chunks = chunkArray(items, chunkSize);

	for (const chunk of chunks) {
		await processFn(chunk);
	}
}
