export const ErrorTypeToMessages = new Map<string, string>([
  ["invalid-email", "INVALID EMAIL"],
  ["invalid-characters", "PLEASE USE LATIN LETTERS (A-Z)"],
  ["invalid-password", "INVALID PASSWORD"],
  ["not-enough-characters", "Have at least 8 characters"],
  ["missing-digit", "Have at least 1 digit"],
  ["missing-uppercase-letter", "Have at least 1 uppercase letter"],
  ["missing-lowercase-letter", "Have at least 1 lowercase letter"],
]);
