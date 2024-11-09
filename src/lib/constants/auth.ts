export const SESSION_COOKIE_NAME = 'session' as const;

export const VALIDATION_MESSAGE = {
	GENERIC: 'Something went wrong',
	INVALID_EMAIL: 'Invalid email',
	INVALID_PASSWORD:
		'Make sure password contains at least one uppercase letter, one lowercase letter, one number and is at least 6 characters long',
	USER_ALREADY_EXISTS: 'User already exists',
	INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect email or password'
} as const;
