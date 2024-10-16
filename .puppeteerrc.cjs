// .puppeteerrc.cjs
const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Define que o Chrome será baixado se não estiver presente.
  chrome: {
    skipDownload: false, // Garante que o Chrome será baixado.
  },
  // Muda o diretório de cache para evitar problemas de localização do Chrome.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'), // Define o cache local.
};
