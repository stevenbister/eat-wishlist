import { describe, expect, it, vi } from 'vitest';
import { chunkArray, processInChunks } from './chunkArray';

describe('chunkArray', () => {
	it('should return an empty array when input array is empty', () => {
		expect(chunkArray([], 2)).toEqual([]);
	});

	it('should return an array with one chunk when array size equals chunk size', () => {
		expect(chunkArray([1, 2], 2)).toEqual([[1, 2]]);
	});

	it('should return an array with multiple chunks when array size is greater than chunk size', () => {
		expect(chunkArray([1, 2, 3, 4], 2)).toEqual([
			[1, 2],
			[3, 4]
		]);
	});

	it('should return an array with one chunk when array size is less than chunk size', () => {
		expect(chunkArray([1, 2], 3)).toEqual([[1, 2]]);
	});

	it('should return an array with each element as a separate chunk when chunk size is 1', () => {
		expect(chunkArray([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
	});

	it('should return the original array when chunk size is greater than array size', () => {
		expect(chunkArray([1, 2], 3)).toEqual([[1, 2]]);
	});
});

describe('processInChunks', () => {
	it('should process an empty array', async () => {
		const items: number[] = [];
		const chunkSize = 2;
		const processFn = vi.fn(() => Promise.resolve());
		await processInChunks(items, chunkSize, processFn);
		expect(processFn).not.toHaveBeenCalled();
	});

	it('should process an array with chunk size equal to array length', async () => {
		const items = [1, 2, 3];
		const chunkSize = 3;
		const processFn = vi.fn(() => Promise.resolve());
		await processInChunks(items, chunkSize, processFn);
		expect(processFn).toHaveBeenCalledTimes(1);
		expect(processFn).toHaveBeenCalledWith(items);
	});

	it('should process an array with chunk size less than array length', async () => {
		const items = [1, 2, 3, 4, 5];
		const chunkSize = 2;
		const processFn = vi.fn(() => Promise.resolve());
		await processInChunks(items, chunkSize, processFn);
		expect(processFn).toHaveBeenCalledTimes(3);
		expect(processFn).toHaveBeenNthCalledWith(1, [1, 2]);
		expect(processFn).toHaveBeenNthCalledWith(2, [3, 4]);
		expect(processFn).toHaveBeenNthCalledWith(3, [5]);
	});

	it('should process an array with chunk size greater than array length', async () => {
		const items = [1, 2, 3];
		const chunkSize = 5;
		const processFn = vi.fn(() => Promise.resolve());
		await processInChunks(items, chunkSize, processFn);
		expect(processFn).toHaveBeenCalledTimes(1);
		expect(processFn).toHaveBeenCalledWith(items);
	});

	it('should throw an error if process function throws an error', async () => {
		const items = [1, 2, 3];
		const chunkSize = 2;
		const processFn = vi.fn(() => Promise.reject(new Error('Test error')));
		await expect(processInChunks(items, chunkSize, processFn)).rejects.toThrowError('Test error');
	});

	it('should resolve successfully if process function resolves successfully', async () => {
		const items = [1, 2, 3];
		const chunkSize = 2;
		const processFn = vi.fn(() => Promise.resolve());
		await expect(processInChunks(items, chunkSize, processFn)).resolves.not.toThrowError();
	});
});
