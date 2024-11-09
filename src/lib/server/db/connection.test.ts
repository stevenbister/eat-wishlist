import { env } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/d1';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { Database, type DBType } from './connection';

vi.mock('drizzle-orm/d1', () => ({
	drizzle: vi.fn()
}));

const mockDBBindings: DBType = env.DB;
const mockDbClient = vi.mocked(drizzle);

describe('Database.initialize', () => {
	beforeEach(() => {
		// Reset the instance before each test to avoid singleton pollution across tests
		Database['instance'] = null;
		Database['DB'] = undefined;
		vi.clearAllMocks();
	});

	it('should initialize with a valid DB instance', () => {
		(drizzle as Mock).mockReturnValue(mockDbClient);

		const dbClient = Database.initialize(mockDBBindings);

		expect(drizzle).toHaveBeenCalledWith(mockDBBindings);
		expect(dbClient).toBe(mockDbClient);
	});

	it('should return the same instance when initialized multiple times', () => {
		(drizzle as Mock).mockReturnValue(mockDbClient);

		const firstInstance = Database.initialize(mockDBBindings);
		const secondInstance = Database.initialize(mockDBBindings);

		expect(firstInstance).toBe(secondInstance);
		expect(drizzle).toHaveBeenCalledTimes(1);
	});

	it('should throw an error with an undefined DB instance', () => {
		expect(() => Database.initialize(undefined)).toThrowError();
	});

	it('should return the same instance with getInstance after initialization', () => {
		(drizzle as Mock).mockReturnValue(mockDbClient);

		Database.initialize(mockDBBindings);
		const dbClient = Database.getInstance();

		expect(dbClient).toBe(mockDbClient);
	});

	it('should throw an error if initialize is called without a DBType instance', () => {
		expect(() => Database.initialize(undefined)).toThrowError();
	});
});
