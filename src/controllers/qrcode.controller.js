import prompt from "prompt";
import chalk from "chalk";
import { qrCodePromptSchema } from "../schemas/qrcode.schema.js";
import { generateTerminalQRCode, generateQRCodeImage } from "../services/qrcode/qrcode.service.js";
import { logger } from "../utils/logger.js";

/**
 * Função utilitária para capturar entrada do prompt usando Promises.
 */
function promptAsync(schema) {
  return new Promise((resolve, reject) => {
    prompt.get(schema, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

export async function handleQRCodeController() {
  logger.section("Gerador de QR Code");

  try {
    const input = await promptAsync(qrCodePromptSchema);

    if (!input || !input.link) {
      logger.warn("Operação cancelada pelo usuário.");
      return;
    }

    const { link, type } = input;

    if (type === "1") {
      // Terminal Normal
      const qrAscii = await generateTerminalQRCode(link, false);
      logger.success("QR Code gerado com sucesso no terminal (Padrão)!\n");
      console.log(qrAscii);
    } else if (type === "2") {
      // Terminal Compacto
      const qrAscii = await generateTerminalQRCode(link, true);
      logger.success("QR Code gerado com sucesso no terminal (Compacto)!\n");
      console.log(qrAscii);
    } else if (type === "3") {
      // Arquivo PNG
      logger.info("Gerando imagem PNG em alta resolução...");
      const { filePath, filename } = await generateQRCodeImage(link, "./output");
      logger.success(`QR Code salvo com sucesso em imagem PNG!`);
      console.log(`• Arquivo: ${chalk.cyan(filename)}`);
      console.log(`• Caminho: ${chalk.green(filePath)}`);
    }
  } catch (error) {
    if (error.message === "canceled") {
      logger.warn("\nOperação de QR Code cancelada pelo usuário.");
      return;
    }
    logger.error(`Falha ao gerar QR Code: ${error.message}`);
  }
}
