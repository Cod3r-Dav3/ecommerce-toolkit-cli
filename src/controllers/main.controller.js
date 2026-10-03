import prompt from "prompt";
import chalk from "chalk";
import { mainPromptSchema } from "../schemas/main.schema.js";
import { handleQRCodeController } from "./qrcode.controller.js";
import { handlePasswordController } from "./password.controller.js";
import { logger } from "../utils/logger.js";

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

export async function startApp() {
  // Configurações visuais do prompt
  prompt.message = "";
  prompt.delimiter = chalk.gray(" >");
  prompt.start();

  logger.banner();

  let isRunning = true;

  while (isRunning) {
    try {
      console.log(chalk.bold.underline("\nMENU PRINCIPAL"));
      const result = await promptAsync(mainPromptSchema);

      if (!result) {
        isRunning = false;
        break;
      }

      switch (result.choice) {
        case "1":
          await handleQRCodeController();
          break;
        case "2":
          await handlePasswordController();
          break;
        case "0":
          logger.info("Encerrando o E-commerce Toolkit CLI. Até breve!");
          isRunning = false;
          break;
        default:
          logger.warn("Opção não reconhecida.");
      }
    } catch (error) {
      if (error.message === "canceled") {
        console.log();
        logger.info("Aplicação finalizada pelo usuário (Ctrl+C). Até logo!");
        isRunning = false;
        break;
      }

      logger.error(`Ocorreu um erro inesperado: ${error.message}`);
    }
  }
}
