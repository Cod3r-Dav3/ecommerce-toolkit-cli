import { startApp } from "./controllers/main.controller.js";
import { logger } from "./utils/logger.js";

// Tratamento de exceções globais para evitar falhas silenciosas
process.on("unhandledRejection", (reason) => {
  logger.error(`Erro assíncrono não tratado: ${reason?.message || reason}`);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error(`Erro crítico não tratado: ${error?.message || error}`);
  process.exit(1);
});

startApp();