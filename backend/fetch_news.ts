import express, { Request, Response } from 'express';
import NewsAPI from 'newsapi';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const newsapi = new NewsAPI(process.env.NEWS_API_KEY || '');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * A simple sleep function to pause execution.
 * @param ms The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified time.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a poll question and choices based on a news article's title and description.
 * @param title The title of the news article.
 * @param description The description of the news article.
 * @returns A promise that resolves to an object containing the question and choices.
 */
async function generatePoll(title: string, description: string): Promise<{ question: string; choices: string[] }> {
  const prompt = `
Given the following news headline and description, generate an insightful public voting question and 3–4 meaningful options for people to choose from.

Requirements:
- Question must be neutral but thought-provoking (e.g. prediction, opinion, or preference)
- Options should reflect different real-world perspectives (e.g. optimistic, skeptical, uncertain, etc.)
- Keep choices under 8 words each
- Output in valid JSON:
{
  "question": "...",
  "choices": ["...", "...", "...", "..."]
}

Title: ${title}
Description: ${description}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error(`Error with: ${title} — ${error}`);
    return {
      question: 'N/A',
      choices: [],
    };
  }
}

app.get('/api/news-polls', async (req: Request, res: Response) => {
  try {
    const topHeadlines = await newsapi.v2.topHeadlines({
      sources: 'techcrunch,crypto-coins-news',
      language: 'en',
      page: 1,
    });

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

    res.json(output);
  } catch (error) {
    console.error('Error fetching news or generating polls:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}` );
});
