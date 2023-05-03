import { ValidationT } from "./ValidationType";

const containsDigitRegex = new RegExp("[0-9]+");
const containsUppercaseLetterRegex = new RegExp("[A-Z]+");
const containsLowercaseLetterRegex = new RegExp("[a-z]+");

function containsEightCharacters(password: string): boolean {
	return password.length >= 8;
}

function containsDigit(password: string): boolean {
	return containsDigitRegex.test(password);
}

function containsUppercaseLetter(password: string): boolean {
	return containsUppercaseLetterRegex.test(password);
}

function containsLowercaseLetter(password: string): boolean {
	return containsLowercaseLetterRegex.test(password);
}

export function isPasswordSecure(password: string): ValidationT {
	if (!containsEightCharacters(password)) {
		return { passed: false, errorType: "not-enough-characters" };
	}

	if (!containsDigit(password)) {
		return { passed: false, errorType: "missing-digit" };
	}

	if (!containsUppercaseLetter(password)) {
		return { passed: false, errorType: "missing-uppercase-letter" };
	}

	if (!containsLowercaseLetter(password)) {
		return { passed: false, errorType: "missing-lowercase-letter" };
	}

	return { passed: true };
}
