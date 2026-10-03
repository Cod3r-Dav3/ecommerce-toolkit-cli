import chalk from "chalk";

export const mainPromptSchema = {
  properties: {
    choice: {
      description: chalk.yellow.bold(
        "Selecione uma opção:\n" +
        "  1) Gerar QR Code (Terminal ou Imagem PNG)\n" +
        "  2) Gerar Senha Segura (com Análise de Força)\n" +
        "  0) Sair do Sistema\n" +
        "Escolha"
      ),
      pattern: /^[0-2]$/,
      message: chalk.red("Opção inválida! Escolha entre 0, 1 ou 2."),
      required: true,
    },
  },
};
