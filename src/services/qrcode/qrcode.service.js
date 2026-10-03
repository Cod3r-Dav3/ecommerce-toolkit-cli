import fs from "node:fs/promises";
import path from "node:path";
import qrTerminal from "qrcode-terminal";
import QRCode from "qrcode";

/**
 * Gera um QR Code no terminal.
 * @param {string} text Conteúdo / Link do QR Code
 * @param {boolean} isSmall Se verdadeiro, gera a versão compacta para terminais menores
 * @returns {Promise<string>} String contendo os caracteres ASCII do QR Code
 */
export async function generateTerminalQRCode(text, isSmall = false) {
  return new Promise((resolve) => {
    qrTerminal.generate(text, { small: isSmall }, (code) => {
      resolve(code);
    });
  });
}

/**
 * Gera um arquivo PNG de alta qualidade com o QR Code.
 * @param {string} text Conteúdo / Link do QR Code
 * @param {string} outputDir Diretório de saída (default: './output')
 * @returns {Promise<{ filePath: string, filename: string }>}
 */
export async function generateQRCodeImage(text, outputDir = "./output") {
  const resolvedDir = path.resolve(process.cwd(), outputDir);
  await fs.mkdir(resolvedDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `qrcode-${timestamp}.png`;
  const filePath = path.join(resolvedDir, filename);

  const options = {
    errorCorrectionLevel: "H",
    type: "png",
    quality: 0.95,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    width: 512,
  };

  await QRCode.toFile(filePath, text, options);

  return {
    filePath,
    filename,
  };
}
