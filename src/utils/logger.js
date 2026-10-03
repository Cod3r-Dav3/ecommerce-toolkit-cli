import chalk from "chalk";

export const logger = {
  banner() {
    console.log();
    console.log(chalk.cyan.bold("╔══════════════════════════════════════════════════════╗"));
    console.log(chalk.cyan.bold("║            🛒  E-COMMERCE TOOLKIT CLI  🛒            ║"));
    console.log(chalk.cyan.bold("║     Utilitários Essenciais para Comércio Digital     ║"));
    console.log(chalk.cyan.bold("╚══════════════════════════════════════════════════════╝"));
    console.log();
  },

  section(title) {
    console.log();
    console.log(chalk.cyan.bold(`▶ ${title}`));
    console.log(chalk.gray("─".repeat(50)));
  },

  success(message) {
    console.log(chalk.green(`✔ ${message}`));
  },

  info(message) {
    console.log(chalk.blue(`ℹ ${message}`));
  },

  warn(message) {
    console.log(chalk.yellow(`⚠ ${message}`));
  },

  error(message) {
    console.log(chalk.red(`✖ ${message}`));
  },

  divider() {
    console.log(chalk.gray("─".repeat(50)));
  }
};
