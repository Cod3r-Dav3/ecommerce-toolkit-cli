import crypto from "node:crypto";
import { CHARACTER_SETS } from "./constants.js";
import { envConfig } from "../../config/env.js";

/**
 * Monta o conjunto de caracteres permitidos baseado nas configurações.
 */
export function getPermittedCharacters(config = envConfig.password) {
  let pool = "";

  if (config.uppercase) pool += CHARACTER_SETS.UPPERCASE;
  if (config.lowercase) pool += CHARACTER_SETS.LOWERCASE;
  if (config.numbers) pool += CHARACTER_SETS.NUMBERS;
  if (config.specialCharacters) pool += CHARACTER_SETS.SPECIAL;

  // Fallback de segurança se todos estiverem desligados
  if (!pool) {
    pool = CHARACTER_SETS.LOWERCASE + CHARACTER_SETS.NUMBERS;
  }

  return pool;
}

/**
 * Calcula a entropia da senha em bits e estima a força de segurança.
 * Fórmula: E = L * log2(R)
 * Onde L = comprimento da senha, R = tamanho do pool de caracteres.
 */
export function analyzePasswordStrength(password, poolSize) {
  const length = password.length;
  if (length === 0 || poolSize <= 1) {
    return {
      entropy: 0,
      score: "Muito Fraca",
      color: "red",
      crackTime: "instantâneo",
    };
  }

  const entropy = Math.round(length * Math.log2(poolSize));

  // Estimativa baseada em um ataque de força bruta com 10 bilhões de tentativas por segundo (GPU cluster moderno)
  const guessesPerSecond = 1e10;
  const totalCombinations = Math.pow(poolSize, length);
  const secondsToCrack = (totalCombinations / 2) / guessesPerSecond;

  let crackTime = "instantâneo";
  if (secondsToCrack > 31536000 * 1000000) {
    crackTime = "bilhões de anos";
  } else if (secondsToCrack > 31536000 * 1000) {
    crackTime = "milhares de anos";
  } else if (secondsToCrack > 31536000) {
    const years = Math.round(secondsToCrack / 31536000);
    crackTime = `~${years} ano${years > 1 ? "s" : ""}`;
  } else if (secondsToCrack > 86400) {
    const days = Math.round(secondsToCrack / 86400);
    crackTime = `~${days} dia${days > 1 ? "s" : ""}`;
  } else if (secondsToCrack > 3600) {
    const hours = Math.round(secondsToCrack / 3600);
    crackTime = `~${hours} hora${hours > 1 ? "s" : ""}`;
  } else if (secondsToCrack > 60) {
    const minutes = Math.round(secondsToCrack / 60);
    crackTime = `~${minutes} minuto${minutes > 1 ? "s" : ""}`;
  } else if (secondsToCrack > 1) {
    crackTime = `${Math.round(secondsToCrack)} segundos`;
  }

  let score = "Fraca";
  let color = "red";

  if (entropy >= 80) {
    score = "Extremamente Segura (Padrão Enterprise)";
    color = "green";
  } else if (entropy >= 60) {
    score = "Forte (Recomendada para E-commerce)";
    color = "cyan";
  } else if (entropy >= 40) {
    score = "Média / Razoável";
    color = "yellow";
  } else {
    score = "Fraca (Vulnerável)";
    color = "red";
  }

  return {
    entropy,
    score,
    color,
    crackTime,
    poolSize,
  };
}

/**
 * Gera uma senha criptograficamente segura utilizando crypto.randomInt.
 */
export async function generateSecurePassword(customLength = null) {
  const config = envConfig.password;
  const length = customLength || config.length;
  const pool = getPermittedCharacters(config);

  const selectedSets = [];
  if (config.uppercase) selectedSets.push(CHARACTER_SETS.UPPERCASE);
  if (config.lowercase) selectedSets.push(CHARACTER_SETS.LOWERCASE);
  if (config.numbers) selectedSets.push(CHARACTER_SETS.NUMBERS);
  if (config.specialCharacters) selectedSets.push(CHARACTER_SETS.SPECIAL);

  const passwordChars = [];

  // Garante pelo menos um caractere de cada categoria selecionada
  for (const set of selectedSets) {
    if (passwordChars.length < length) {
      const idx = crypto.randomInt(0, set.length);
      passwordChars.push(set[idx]);
    }
  }

  // Preenche o restante com caracteres aleatórios do pool completo
  while (passwordChars.length < length) {
    const idx = crypto.randomInt(0, pool.length);
    passwordChars.push(pool[idx]);
  }

  // Embaralha usando o algoritmo Fisher-Yates com gerador seguro
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  const password = passwordChars.join("");
  const analysis = analyzePasswordStrength(password, pool.length);

  return {
    password,
    length,
    analysis,
  };
}
