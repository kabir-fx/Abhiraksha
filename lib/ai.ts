import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn(
    "GOOGLE_API_KEY is not set in environment variables. AI extraction will fail.",
  );
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

export const getGenerativeModel = (model: string = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model });
};
