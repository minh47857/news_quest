// Client-side news polls utility
// This is a browser-compatible version that provides mock data
// In a real implementation, this would call your backend API

/**
 * A simple sleep function to pause execution.
 * @param {number} ms The number of milliseconds to sleep.
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock crypto-related news data with generated polls
 */
const mockNewsData = [
  {
    title: "What will be Bitcoin's price trajectory in the next 3 months?",
    description: "Bitcoin reaches new all-time high above $120K as institutional adoption accelerates and ETF inflows continue to surge.",
    published_at: "2025-08-02T10:30:00Z",
    question: "What will be Bitcoin's price trajectory in the next 3 months?",
    choices: ["Continue rising to $150K", "Stabilize around $120K", "Correct to $90K", "Highly volatile swings"]
  },
  {
    title: "Which altcoin will outperform in the next bull run?",
    description: "Ethereum, Solana, and other major altcoins show strong momentum as the crypto market enters a new phase of growth.",
    published_at: "2025-08-02T09:15:00Z",
    question: "Which altcoin will outperform in the next bull run?",
    choices: ["Ethereum (ETH)", "Solana (SOL)", "Cardano (ADA)", "Polygon (MATIC)"]
  },
  {
    title: "How will crypto regulation impact market growth?",
    description: "Major countries announce comprehensive cryptocurrency regulation frameworks, providing clarity for institutional investors.",
    published_at: "2025-08-02T08:45:00Z",
    question: "How will crypto regulation impact market growth?",
    choices: ["Boost institutional adoption", "Reduce market volatility", "Slow down innovation", "Mixed positive/negative effects"]
  },
  {
    title: "When will crypto mass adoption reach 50% globally?",
    description: "Current crypto adoption sits at 15% globally, with emerging markets leading the charge in digital asset usage.",
    published_at: "2025-08-02T07:20:00Z",
    question: "When will crypto mass adoption reach 50% globally?",
    choices: ["Within 3 years", "3-7 years", "7-15 years", "More than 15 years"]
  },
  {
    title: "What's the biggest threat to DeFi protocols?",
    description: "DeFi total value locked reaches $200B as new protocols emerge, but security concerns and regulatory pressure mount.",
    published_at: "2025-08-02T06:00:00Z",
    question: "What's the biggest threat to DeFi protocols?",
    choices: ["Smart contract vulnerabilities", "Regulatory crackdowns", "Centralization risks", "Market manipulation"]
  },
  {
    title: "Which blockchain will dominate Web3 development?",
    description: "Competition intensifies between Layer 1 blockchains as developers choose platforms for next-generation dApps.",
    published_at: "2025-08-01T18:30:00Z",
    question: "Which blockchain will dominate Web3 development?",
    choices: ["Ethereum", "Solana", "Polygon", "Multi-chain future"]
  },
  {
    title: "What will drive the next crypto bull market?",
    description: "Analysts debate whether institutional adoption, retail FOMO, or technological breakthroughs will fuel the next rally.",
    published_at: "2025-08-01T16:45:00Z",
    question: "What will drive the next crypto bull market?",
    choices: ["Institutional adoption", "Retail investor FOMO", "Tech breakthroughs", "Regulatory clarity"]
  },
  {
    title: "When will Central Bank Digital Currencies (CBDCs) launch globally?",
    description: "Multiple countries accelerate CBDC development as digital payment systems become critical infrastructure.",
    published_at: "2025-08-01T15:20:00Z",
    question: "When will Central Bank Digital Currencies (CBDCs) launch globally?",
    choices: ["Within 2 years", "2-5 years", "5-10 years", "Gradual rollout over decades"]
  },
  {
    title: "What's the future of NFTs beyond digital art?",
    description: "NFT technology evolves beyond collectibles into gaming, real estate, identity verification, and enterprise solutions.",
    published_at: "2025-08-01T14:10:00Z",
    question: "What's the future of NFTs beyond digital art?",
    choices: ["Gaming and metaverse", "Real estate tokenization", "Identity verification", "Enterprise utilities"]
  },
  {
    title: "Which crypto trend will dominate 2025?",
    description: "From AI-powered DeFi to quantum-resistant blockchains, multiple trends compete for market attention this year.",
    published_at: "2025-08-01T13:30:00Z",
    question: "Which crypto trend will dominate 2025?",
    choices: ["AI-powered DeFi", "Quantum-resistant crypto", "Real-world asset tokenization", "Decentralized social media"]
  }
];

/**
 * Simulate fetching news polls with realistic delay
 * @param {number} pageSize Number of polls to return
 * @param {string} sources News sources (for compatibility, not used in mock)
 * @param {string} language Language preference (for compatibility, not used in mock)
 * @returns {Promise<Array>} Array of news poll objects
 */
export async function fetchNewsPolls(pageSize = 5, sources = '', language = 'en') {
  // TODO: Replace with real API call when backend is ready
  // For now, using mock data because:
  // 1. NewsAPI requires server-side execution (CORS restrictions)
  // 2. Google Generative AI requires API keys and server environment
  // 3. Browser can't access process.env variables
  
  console.log('Using mock data. To use real data, set up backend server or use CORS-enabled APIs.');
  
  // Simulate network delay
  await sleep(Math.random() * 1000 + 500); // 500-1500ms delay
  
  // Shuffle array and return requested number of items
  const shuffled = [...mockNewsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(pageSize, shuffled.length));
}

// Alternative function that could work with a CORS-enabled news API
export async function fetchRealNewsPolls(pageSize = 5) {
  try {
    // Example with a hypothetical CORS-enabled news API
    // You would need to replace with an actual API that allows browser requests
    const response = await fetch(`https://api.example-news.com/headlines?limit=${pageSize}`);
    const data = await response.json();
    
    // Transform the real news data into poll format
    return data.articles.map(article => ({
      title: `What's your opinion on: ${article.title}?`,
      description: article.description,
      published_at: article.publishedAt,
      question: `What's your opinion on: ${article.title}?`,
      choices: ["Strongly agree", "Somewhat agree", "Neutral", "Disagree"]
    }));
  } catch (error) {
    console.error('Failed to fetch real news, falling back to mock data:', error);
    return fetchNewsPolls(pageSize);
  }
}

export default fetchNewsPolls;
