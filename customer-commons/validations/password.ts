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
	let errors = [];

	if (!containsEightCharacters(password)) {
		errors.push("not-enough-characters");
	}

	if (!containsDigit(password)) {
		errors.push("missing-digit");
	}

	if (!containsUppercaseLetter(password)) {
		errors.push("missing-uppercase-letter");
	}

	if (!containsLowercaseLetter(password)) {
		errors.push("missing-lowercase-letter");
	}

	if (errors.length === 0) {
		return { passed: true };
	}

	errors.unshift("invalid-password");

	return { passed: false, errorType: errors };
}
