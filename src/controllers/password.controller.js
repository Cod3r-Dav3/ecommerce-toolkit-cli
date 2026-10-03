import chalk from "chalk";
import { generateSecurePassword } from "../services/password/password.service.js";
import { envConfig } from "../config/env.js";
import { logger } from "../utils/logger.js";

export async function handlePasswordController() {
  logger.section("Gerador de Senha Segura");

  try {
    const { password, length, analysis } = await generateSecurePassword();

    console.log();
    console.log(chalk.bold("Sua Senha Gerada:"));
    console.log(chalk.black.bgGreen.bold(` ${password} `));
    console.log();

    logger.divider();
    console.log(chalk.bold("Métricas de Segurança:"));
    console.log(`• Comprimento:      ${chalk.cyan(length)} caracteres`);
    console.log(`• Espaço Amostral:  ${chalk.cyan(analysis.poolSize)} caracteres possíveis`);
    console.log(`• Entropia:         ${chalk.cyan(analysis.entropy + " bits")}`);
    
    const coloredScore = chalk[analysis.color] ? chalk[analysis.color].bold(analysis.score) : chalk.white(analysis.score);
    console.log(`• Nível de Força:   ${coloredScore}`);
    console.log(`• Tempo para Quebra:${chalk.magenta(" " + analysis.crackTime)}`);

    logger.divider();
    console.log(chalk.gray("Parâmetros do .env: ") +
      chalk.dim(`[Maiúsculas: ${envConfig.password.uppercase} | Minúsculas: ${envConfig.password.lowercase} | Números: ${envConfig.password.numbers} | Especiais: ${envConfig.password.specialCharacters}]`));
    logger.success("Senha gerada com sucesso!");
  } catch (error) {
    logger.error(`Falha ao gerar senha: ${error.message}`);
  }
}
