import { drizzle } from 'drizzle-orm/d1';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DbClient } from './connection';
import { User } from './User';

type MockUser = Partial<Awaited<ReturnType<typeof user.createUser>>>;

vi.mock('drizzle-orm/d1', () => ({
	drizzle: vi.fn()
}));

const mockDbClient = vi.mocked(drizzle) as unknown as DbClient;

const mockUser: MockUser = {
	id: 'mock-user-id',
	email: 'mock-user-email@test.com'
};
const mockPassword = 'moc5-p@ssWord';

const user = new User(mockDbClient);

describe('User', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('User.getByEmail', () => {
		it('returns user with matching email', async () => {
			mockDbClient.select = vi.fn().mockReturnValue({
				from: vi.fn().mockReturnValue({
					where: vi.fn().mockResolvedValue([mockUser])
				})
			});

			const [results] = await user.getByEmail(mockUser.email!);
			expect(results).toEqual(mockUser);
		});
	});

	describe('User.hashPassword', () => {
		it('returns hashed password', () => {
			const hashedPassword = user.hashPassword(mockPassword);

			expect(hashedPassword).not.toBe(mockPassword);
			expect(typeof hashedPassword).toBe('string');
			expect(hashedPassword.length).toBeGreaterThan(0);
		});
	});

	describe('User.verifyPassword', () => {
		it('returns true when passwords match', () => {
			const hashedPassword = user.hashPassword(mockPassword);
			const verifiedPassword = user.verifyPassword(hashedPassword, mockPassword);

			expect(verifiedPassword).toBe(true);
		});

		it("returns false when passwords don't match", () => {
			const hashedPassword = user.hashPassword(mockPassword);
			const verifiedPassword = user.verifyPassword(hashedPassword, 'wrongPassword');

			expect(verifiedPassword).toBe(false);
		});
	});

	describe('User.createUser', () => {
		it('creates a user with valid email and password', async () => {
			mockDbClient.insert = vi.fn().mockReturnValue({
				values: vi.fn().mockReturnValue({
					returning: vi.fn().mockResolvedValue([mockUser])
				})
			});

			const result = await user.createUser(mockUser.email!, mockPassword);
			expect(result).toEqual(mockUser);
		});
	});

	describe('User.generateId', () => {
		it('generates a valid ID', () => {
			expect(user.generateId()).toMatch(/^[a-z0-9]{24}$/);
		});
	});

	describe('User.validateEmail', () => {
		it('returns true when email is valid', () => {
			expect(user.validateEmail(mockUser.email)).toBe(true);
		});

		it('returns false when email is invalid', () => {
			expect(user.validateEmail('invalid')).toBe(false);
		});
	});

	describe('User.validatePassword', () => {
		it('returns true when password is valid', () => {
			expect(user.validatePassword(mockPassword)).toBe(true);
		});

		it('returns false when password is invalid', () => {
			const password = 'password';

			expect(user.validatePassword(password)).toBe(false);
		});
	});
});
