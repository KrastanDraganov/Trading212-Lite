import { ValidationT } from "./ValidationType";

const containsOnlyLatinCharactersRegex = new RegExp("^[a-z ,.'-]+$");

export function containsOnlyLatinCharacters(value: string): ValidationT {
	return containsOnlyLatinCharactersRegex.test(value.toLowerCase())
		? { passed: true }
		: { passed: false, errorType: "invalid-characters" };
}
