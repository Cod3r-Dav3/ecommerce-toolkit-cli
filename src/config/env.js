/**
 * Centraliza e valida as variáveis de ambiente com valores padrão seguros.
 */
function parseBoolean(value, defaultValue) {
  if (value === undefined || value === null || value.trim() === "") {
    return defaultValue;
  }
  return value.trim().toLowerCase() === "true";
}

function parseNumber(value, defaultValue, min = 4, max = 128) {
  if (value === undefined || value === null || value.trim() === "") {
    return defaultValue;
  }
  const parsed = parseInt(value.trim(), 10);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  return Math.min(Math.max(parsed, min), max);
}

export const envConfig = {
  password: {
    uppercase: parseBoolean(process.env.UPPERCASE_LETTERS, true),
    lowercase: parseBoolean(process.env.LOWERCASE_LETTERS, true),
    numbers: parseBoolean(process.env.NUMBERS, true),
    specialCharacters: parseBoolean(process.env.SPECIAL_CHARACTERS, true),
    length: parseNumber(process.env.PASSWORD_LENGTH, 16, 4, 128),
  },
};
