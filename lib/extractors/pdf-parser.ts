import { extractText } from "unpdf";

/**
 * Extracts raw text from a PDF buffer.
 * Uses `unpdf` — a lightweight server-side PDF text extraction library
 * that doesn't require web workers.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const { text } = await extractText(new Uint8Array(buffer), {
    mergePages: true,
  });
  return text;
}
