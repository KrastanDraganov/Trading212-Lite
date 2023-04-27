const emailRegexSimple = new RegExp(
	"^(?! )[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+.([A-Za-z]{2,15})$"
);

export function isValidEmail(value: string): boolean {
	return emailRegexSimple.test(value);
}