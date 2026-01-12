import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export async function generatePDF(html: string, fileName: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const dir = path.join(process.cwd(), 'storage/pdf');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, fileName);

  await page.pdf({
    path: filePath,
    format: 'A4',
    margin: { top: 40, bottom: 40, left: 40, right: 40 }
  });

  await browser.close();
  return filePath;
}
