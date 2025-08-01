import NewsAPI from 'newsapi';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const newsapi = new NewsAPI(process.env.NEWS_API_KEY || '');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * A simple sleep function to pause execution.
 * @param {number} ms The number of milliseconds to sleep.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate a poll from news title and description
 * @param {string} title 
 * @param {string} description 
 * @returns {Promise<{question: string, choices: string[]}>}
 */
async function generatePoll(title, description) {
  const prompt = `
Given the following news headline and description, generate an insightful public voting question and 3–4 meaningful options for people to choose from.

Requirements:
- Question must be neutral but thought-provoking (e.g. prediction, opinion, or preference)
- Options should reflect different real-world perspectives (e.g. optimistic, skeptical, uncertain, etc.)
- Keep choices under 8 words each
- Output in valid JSON:
{ "question": "...", "choices": ["...", "...", "...", "..."] }

Title: ${title}
Description: ${description}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Error generating poll for: ${title}`, error);
    return { question: 'N/A', choices: [] };
  }
}

/**
 * Fetch news polls from API
 * @param {number} pageSize 
 * @param {string} sources 
 * @param {string} language 
 * @returns {Promise<Array<{title: string, description: string, published_at: string, question: string, choices: string[]}>>}
 */
export async function fetchNewsPolls(
  pageSize = 5,
  sources = 'techcrunch, crypto-coins-news',
  language = 'en'
) {
  const topHeadlines = await newsapi.v2.topHeadlines({ sources, language, page: 1, pageSize });
  const output = [];

  for (const article of topHeadlines.articles) {
    const { title, description, publishedAt } = article;
    if (title && description) {
      const poll = await generatePoll(title, description);
      output.push({
        title,
        description,
        published_at: publishedAt,
        question: poll.question,
        choices: poll.choices,
      });
      await sleep(4000);
    }
  }
  return output;
}
