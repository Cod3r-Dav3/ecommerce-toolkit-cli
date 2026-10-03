import chalk from "chalk";

export const qrCodePromptSchema = {
  properties: {
    link: {
      description: chalk.yellow("Digite a URL ou texto para gerar o QR Code"),
      required: true,
      message: chalk.red("O conteúdo para o QR Code é obrigatório."),
    },
    type: {
      description: chalk.yellow(
        "Escolha o formato de saída:\n" +
        "  1) Terminal - Padrão\n" +
        "  2) Terminal - Compacto\n" +
        "  3) Arquivo de Imagem PNG (salvar em ./output)\n" +
        "Opção"
      ),
      pattern: /^[1-3]$/,
      message: chalk.red("Opção inválida! Escolha 1, 2 ou 3."),
      required: true,
    },
  },
};
