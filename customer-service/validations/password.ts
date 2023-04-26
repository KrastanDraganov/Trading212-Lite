export function isPasswordSecure(password: string): boolean {
	return password.length > 8;
}
