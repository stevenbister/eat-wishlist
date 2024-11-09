import { SESSION_COOKIE_NAME } from '$lib/constants/auth';
import { DAY_IN_MS } from '$lib/constants/misc';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/d1';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DbClient } from './connection';
import type { SessionValidationResult } from './Session';
import { Session } from './Session';

vi.mock('drizzle-orm/d1', () => ({
	drizzle: vi.fn()
}));

vi.mock('@sveltejs/kit', () => ({
	RequestEvent: {
		cookies: {
			set: vi.fn(),
			delete: vi.fn()
		}
	}
}));

vi.mock(import('@oslojs/encoding'), async (importOriginal) => {
	const actual = await importOriginal();

	return {
		...actual,
		encodeHexLowerCase: vi.fn()
	};
});

vi.mock('@oslojs/crypto/sha2', () => ({
	sha256: vi.fn()
}));

const mockDbClient = vi.mocked(drizzle) as unknown as DbClient;

const mockSessionId = 'mock-session-id';
const mockToken = 'mock-token';
const mockUserId = 'mock-user-id';
const mockUserEmail = 'mock-user-email@test.com';
const mockUserName = 'mock-user-name';

const mockCreateQuery = (sessionId: string, userId: string, expiresAt: Date) => {
	const mock = (mockDbClient.insert = vi.fn().mockReturnValue({
		values: vi.fn().mockReturnValue({
			returning: vi.fn().mockReturnValue([{ id: sessionId, userId, expiresAt }])
		})
	}));

	return mock;
};

const mockValidationQuery = (params: SessionValidationResult[] = []) => {
	const mock = (mockDbClient.select = vi.fn().mockReturnValue({
		from: vi.fn().mockReturnValue({
			innerJoin: vi.fn().mockReturnValue({
				where: vi.fn().mockResolvedValue([...params])
			})
		})
	}));

	return mock;
};

const session = new Session(mockDbClient);

describe('Session', () => {
	beforeEach(() => {
		// Mock the hashing functions to produce the expected session ID
		vi.mocked(sha256).mockReturnValue(new Uint8Array([]));
		vi.mocked(encodeHexLowerCase).mockReturnValue(mockSessionId);

		vi.clearAllMocks();
	});

	describe('Session.generateToken', () => {
		it('should generate a valid token', () => {
			const token = session.generateToken();

			expect(token).toBeDefined();
			expect(token.length).toBe(32);
			expect(token).toMatch(/^[a-z0-9]{32}$/);
		});

		it('should generate a different token each time', () => {
			const token1 = session.generateToken();
			const token2 = session.generateToken();

			expect(token1).not.toBe(token2);
		});
	});

	describe('Session.create', () => {
		it('creates a session with valid token and userId', async () => {
			const expiresAt = new Date();

			mockCreateQuery(mockSessionId, mockUserId, expiresAt);

			const result = await session.create(mockToken, mockUserId);

			expect(result).toEqual({
				id: mockSessionId,
				userId: mockUserId,
				expiresAt: expect.any(Date)
			});
		});
	});

	describe('Session.validate', () => {
		it('returns null session and user when session is not found', async () => {
			mockValidationQuery();

			const result = await session.validate(mockToken);

			expect(result).toEqual({ session: null, user: null });
		});

		it('returns null session and user when session has expired', async () => {
			const pastDate = new Date(Date.now() - DAY_IN_MS * 2); // expired two days ago

			mockValidationQuery([
				{
					session: { id: mockSessionId, userId: mockUserId, expiresAt: pastDate },
					user: { id: mockUserId, email: mockUserEmail, name: mockUserName }
				}
			]);

			const deleteMock = vi.spyOn(session, 'deleteById').mockResolvedValue([
				{
					id: mockSessionId,
					userId: mockUserId,
					expiresAt: pastDate
				}
			]);

			const result = await session.validate(mockToken);

			expect(result).toEqual({ session: null, user: null });
			expect(deleteMock).toHaveBeenCalledWith(mockSessionId); // Ensure expired session is deleted
		});

		it('returns session and user when session is valid and not near expiration', async () => {
			const futureDate = new Date(Date.now() + DAY_IN_MS * 20); // 20 days from now

			const sessionWithUser = {
				session: { id: mockSessionId, userId: mockUserId, expiresAt: futureDate },
				user: { id: mockUserId, email: mockUserEmail, name: mockUserName }
			};

			mockValidationQuery([sessionWithUser]);

			const result = await session.validate(mockToken);

			expect(result).toEqual(sessionWithUser);
		});

		it('extends session expiration when near expiration', async () => {
			vi.useFakeTimers();
			const nearExpiringDate = new Date(Date.now() + DAY_IN_MS * 14); // 14 days from now
			const newExpiryDate = new Date(Date.now() + DAY_IN_MS * 30);

			const sessionWithUser = {
				session: { id: mockSessionId, userId: mockUserId, expiresAt: nearExpiringDate },
				user: { id: mockUserId, email: mockUserEmail, name: mockUserName }
			};

			// Mock db returning a session that is near expiration
			mockValidationQuery([sessionWithUser]);

			// Mock the update operation
			mockDbClient.update = vi.fn().mockReturnValue({
				set: vi.fn().mockReturnValue({
					where: vi
						.fn()
						.mockResolvedValue([
							{ id: mockSessionId, userId: mockUserId, expiresAt: newExpiryDate }
						])
				})
			});

			const result = await session.validate(mockToken);

			expect(result).toEqual({
				session: { ...sessionWithUser.session, expiresAt: newExpiryDate },
				user: { ...sessionWithUser.user }
			});

			expect(mockDbClient.update).toHaveBeenCalled(); // Ensure expiration was updated

			vi.useRealTimers();
		});
	});

	describe('Session.setSessionTokenCookie', () => {
		it('sets the session token cookie', () => {
			const event = { cookies: { set: vi.fn() } } as unknown as RequestEvent;
			const expires = new Date();

			session.setSessionTokenCookie(event, mockToken, expires);

			expect(event.cookies.set).toHaveBeenCalledTimes(1);
			expect(event.cookies.set).toHaveBeenCalledWith(SESSION_COOKIE_NAME, mockToken, {
				expires,
				path: '/'
			});
		});
	});

	describe('Session.deleteSessionTokenCookie', () => {
		it('deletes the session token cookie', async () => {
			const event = { cookies: { delete: vi.fn() } } as unknown as RequestEvent;

			session.deleteSessionTokenCookie(event);

			expect(event.cookies.delete).toHaveBeenCalledTimes(1);
			expect(event.cookies.delete).toHaveBeenCalledWith(SESSION_COOKIE_NAME, expect.any(Object));
		});
	});
});
