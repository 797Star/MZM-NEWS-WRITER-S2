import { ScriptLength, ScriptTone, ScriptType, GeneratedScriptResponse, GroundingChunk } from '../types';
import { getApiKey } from '../services/envConfig';

// Base URL for the Gemini API
const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17';

// News API configuration
const NEWS_API_KEY = '0bc0cd6aa8e3454fbe05facceec2b331';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Helper function to get API URL with key
const getApiUrl = (): string => {
  // Use the new API key directly as requested
  const apiKey = getApiKey();
  return `${GEMINI_API_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
};

// Common function to make API requests to Gemini
const makeGeminiRequest = async (prompt: string): Promise<any> => {
  try {
    const response = await fetch(getApiUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const json = await response.json();
    // Log the full Gemini API response for debugging
    console.log('Gemini API response:', JSON.stringify(json, null, 2));

    if (!response.ok) {
      throw new Error(`API error: ${json.error?.message || response.statusText}`);
    }

    return json;
  } catch (error) {
    console.error('Error making Gemini API request:', error);
    throw error;
  }
};

// Helper to fetch news articles and references from NewsAPI
interface NewsApiArticle {
  title: string;
  description?: string;
  content?: string;
  url?: string;
}

const fetchNewsArticles = async (query: string): Promise<{ content: string; sources: GroundingChunk[] }> => {
  // Use a public CORS proxy for browser compatibility (development only)
  const corsProxy = 'https://api.allorigins.win/raw?url=';
  const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;
  const proxiedUrl = corsProxy + encodeURIComponent(url);
  const response = await fetch(proxiedUrl);
  if (!response.ok) {
    // Try to provide more error details if available
    let errorMsg = 'Failed to fetch news articles';
    try {
      const errorText = await response.text();
      errorMsg += `: ${errorText}`;
    } catch {}
    throw new Error(errorMsg);
  }
  const data = await response.json();
  if (data.articles && data.articles.length > 0) {
    const articles = data.articles.map((a: NewsApiArticle) => {
      return `Title: ${a.title}\nDescription: ${a.description || ''}\nContent: ${a.content || ''}`;
    });
    // Convert to GroundingChunk[]
    const sources: GroundingChunk[] = data.articles.map((a: NewsApiArticle) => ({
      content: [a.title, a.description, a.content].filter(Boolean).join(' | '),
      url: a.url,
      title: a.title,
    }));
    return {
      content: articles.join('\n---\n'),
      sources,
    };
  }
  // If no articles found, return a more user-friendly error message
  throw new Error('မည်သည့်အင်္ဂလိပ်သတင်းအကြောင်းအရာမှ မတွေ့ရှိပါ။\n\nကျေးဇူးပြု၍ သတင်းအကြောင်းအရာ (keywords သို့မဟုတ် URL) ကို ပိုမိုတိကျစွာ ထည့်သွင်းပါ။');
};

// Helper to build Gemini prompt for Burmese translation and writing
const buildGeminiPrompt = (
  newsContent: string,
  length: ScriptLength,
  tone: ScriptTone,
  type: ScriptType
): string => {
  // Tone mapping
  let toneInstruction = '';
  switch (tone) {
    case ScriptTone.FORMAL:
      toneInstruction = 'နေ့စဉ်သတင်းပုံစံ';
      break;
    case ScriptTone.CONVERSATIONAL:
      toneInstruction = 'စကားပြောဟန်';
      break;
    case ScriptTone.SIMPLIFIED:
      toneInstruction = 'သာမန်';
      break;
      
    default:
      toneInstruction = '';
  }
  // Type mapping
  let typeInstruction = '';
  switch (type) {
    case ScriptType.WEB_POST:
      typeInstruction = 'ဝဘ်ဆိုက်ပို့စ်အတွက်';
      break;
    case ScriptType.NEWS_SCRIPT:
      typeInstruction = 'ဗီဒီယို ထုတ်ရန် (Video post)';
      break;
    case ScriptType.SOCIAL_MEDIA:
      typeInstruction = 'လူမှုမီဒီယာအတွက်';
      break;
    default:
      typeInstruction = '';
  }
  return `အောက်ပါအင်္ဂလိပ်သတင်းအကြောင်းအရာများကို မြန်မာဘာသာဖြင့် ${typeInstruction} ${length} အတိုင်း ${toneInstruction} သံဖြင့် ပြန်ဆိုရေးသားပါ။ မည်သည့်အချက်အလက်အသစ်မှ မထည့်ပါနှင့်။ မူရင်းအချက်အလက်များကိုသာ အသုံးပြုပါ။\n\n${newsContent}`;
};

// Helper to fetch the content of a Burmese news article from a URL
const fetchBurmeseNewsContent = async (url: string): Promise<{ content: string; sources: GroundingChunk[] }> => {
  // Use a public CORS proxy for development only
  const corsProxy = 'https://api.allorigins.win/raw?url=';
  try {
    const response = await fetch(corsProxy + encodeURIComponent(url));
    if (!response.ok) {
      throw new Error('Failed to fetch the news article from the provided URL');
    }
    const html = await response.text();
    // Extract the main content from the HTML (very basic, for demo; in production use a proper parser)
    const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const body = match ? match[1] : html;
    // Remove scripts/styles and HTML tags
    const cleaned = body.replace(/<script[\sS]*?<\/script>/gi, '')
      .replace(/<style[\sS]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return {
      content: cleaned,
      sources: [{ content: cleaned, url, title: url }],
    };
  } catch (e) {
    return { content: '', sources: [] };
  }
};

// Function to generate script from file content (uses NewsAPI for facts, Gemini for Burmese writing)
export const generateScriptFromFileContent = async (
  fileContent: string,
  length: ScriptLength,
  tone: ScriptTone,
  type: ScriptType
): Promise<GeneratedScriptResponse> => {
  const { content: newsContent, sources } = await fetchNewsArticles(fileContent);
  const prompt = buildGeminiPrompt(newsContent, length, tone, type);
  const result = await makeGeminiRequest(prompt);
  return {
    script: result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '',
    sources,
    intermediateTranslation: undefined
  };
};

// Function to generate script from Burmese news URL (for video, narrative, Burmese only, no invented facts)
export const generateScriptFromUrl = async (
  url: string,
  length: ScriptLength,
  tone: ScriptTone,
  type: ScriptType
): Promise<GeneratedScriptResponse> => {
  const { content, sources } = await fetchBurmeseNewsContent(url);
  if (!content) {
    return { script: '', sources, intermediateTranslation: undefined };
  }
  let styleGuide = '';
  let extraPrompt = '';
  let typeInstruction = '';
  let toneInstruction = '';
  // Map script length to special news types
  switch (length) {
    case ScriptLength.DETAILED: // LENGTH_DETAILED
      typeInstruction = 'စုံစမ်းဖော်ထုတ်သတင်း';
      styleGuide = `
စုံစမ်းဖော်ထုတ်သတင်း (Investigative Report) ဖွဲ့စည်းပုံ:
- ခေါင်းစဉ် (Title)
- အကျဉ်းချုပ် (Executive Summary)
- နောက်ခံသတင်း (Background)
- သက်ဆိုင်ရာအချက်အလက်များ၊ သက်သေခံချက်များ၊ သက်ဆိုင်သူများ၏ သက်သေခံချက်များ
- သုတေသန၊ သတင်းအရင်းအမြစ်များ၊ သက်ဆိုင်ရာ စာရွက်စာတမ်းများ၊ Wikipedia၊ သုတေသနစာတမ်းများ၊ Google News၊ နိုင်ငံတကာသတင်း၊ မြန်မာသတင်းမီဒီယာ
- သတင်းအချက်အလက်များကို Google Fact Check နှင့် AP Fact Check ဖြင့် စစ်ဆေးပြီး ဖြစ်ကြောင်း footer တွင် disclaimer message (font size small) ဖြင့် ထည့်ပါ။
- အပိုဒ်ခွဲများအလိုက် စနစ်တကျရေးပါ။
`;
      extraPrompt = 'စုံစမ်းဖော်ထုတ်သတင်းအတွက် အထူးသတင်းတင်ပြချက် format ကို အသုံးပြုပါ။';
      break;
    case ScriptLength.ANALYTICAL: // LENGTH_ANALYTICAL
      typeInstruction = 'သတင်းသုံးသပ်ချက်';
      styleGuide = `
သတင်းသုံးသပ်ချက် (Analytical News) ဖွဲ့စည်းပုံ:
- ခေါင်းစဉ် (Title)
- သုံးသပ်ချက်အကျဉ်း (Summary of Analysis)
- အဓိကအချက်များ၊ သက်ဆိုင်ရာအချက်အလက်များ၊ သုတေသန၊ သတင်းအရင်းအမြစ်များ
- သုံးသပ်ချက်၊ သုံးသပ်သူ၏အမြင်၊ သက်ဆိုင်ရာအချက်အလက်များ
- အပိုဒ်ခွဲများအလိုက် စနစ်တကျရေးပါ။
`;
      extraPrompt = 'သတင်းသုံးသပ်ချက်အတွက် သုံးသပ်ချက် format ကို အသုံးပြုပါ။';
      break;
    case ScriptLength.FEATURE: // LENGTH_FEATURE
      typeInstruction = 'သတင်းအထူးအစီအစဉ်';
      styleGuide = `
သတင်းအထူးအစီအစဉ် (Feature News) ဖွဲ့စည်းပုံ:
- ခေါင်းစဉ် (Title)
- အကျဉ်းချုပ် (Summary)
- အဓိကအချက်များ၊ သက်ဆိုင်ရာအချက်အလက်များ၊ သုတေသန၊ သတင်းအရင်းအမြစ်များ
- စိတ်ဝင်စားဖွယ်အကြောင်းအရာများ၊ လူမှုရေး၊ ယဉ်ကျေးမှု၊ သဘာဝပတ်ဝန်းကျင်၊ စီးပွားရေး၊ နည်းပညာ စသည့်အကြောင်းအရာများ
- အပိုဒ်ခွဲများအလိုက် စနစ်တကျရေးပါ။
`;
      extraPrompt = 'သတင်းအထူးအစီအစဉ်အတွက် Feature News format ကို အသုံးပြုပါ။';
      break;
    default:
      // If not a special length, fall back to previous logic
      let isInvestigative = false;
      switch (tone) {
        case ScriptTone.FORMAL:
          toneInstruction = 'နေ့စဉ်သတင်းပုံစံ';
          break;
        case ScriptTone.CONVERSATIONAL:
          toneInstruction = 'စကားပြော';
          break;
        case ScriptTone.SIMPLIFIED:
          toneInstruction = 'သာမန်';
          break;
        default:
          toneInstruction = '';
      }
      if (type === ScriptType.NEWS_SCRIPT && /စုံစမ်း|အထူးစုံစမ်း|investigative|report/i.test(content)) {
        isInvestigative = true;
      }
      if (tone === ScriptTone.CONVERSATIONAL) {
        typeInstruction = type === ScriptType.NEWS_SCRIPT ? 'သတင်းဖတ်ကြားရန်' : 'ဗီဒီယို ထုတ်ရန် (Video post)';
        styleGuide = `
သတင်းဖတ်ကြားရန် စကားပြောသံ script များအတွက်:
- ပရိသတ်များ မင်္ဂလာပါ ခင်ဗျာ/ရှင်၊ (သတင်းအစမှာ)
- မဇ္ဈိမရဲ့ ("နောက်ဆုံးရသတင်း" OR "သတင်းဆောင်းပါးအစီအစဥ်" OR "အရေးကြီးသတင်း" OR "စီးပွားရေးသတင်း" OR "နိုင်ငံရေးသုံးသပ်ချက်" OR "နိုင်ငံတကာသတင်း" OR "တော်လှန်ရေးသတင်း" OR "အထူးသတင်း" OR "အထူးစုံစမ်းတင်ပြချက်" OR "သတင်းအနှစ်ချုပ်") တွေကို နားဆင်ကြရမှာ ဖြစ်ပါတယ်။
- သတင်းအကြောင်းအရာကို အပိုင်းလိုက် အပိုဒ်ခွဲပြီး ဖော်ပြပါ (အဓိကအချက်များ၊ အကြောင်းအရာအကျဉ်း၊ အနောက်ခံသတင်း၊ သက်ဆိုင်ရာအချက်အလက်များ)
- သတင်းအဆုံးတွင် နောက်ထပ်သတင်းများအတွက် subscribe လုပ်ရန်/ကြည့်ရှုရန် ဖိတ်ခေါ်ပါ
- သတင်းအချက်အလက်အသစ်မထည့်ပါနှင့်၊ မူရင်းအချက်အလက်များကိုသာ အသုံးပြုပါ
- ယဥ်ကျေးသော မြန်မာစကားပြော အသုံးအနှုန်းများဖြင့် အများဆုံးသုံးနှုန်းပါ
`;
        extraPrompt = 'Greeting နှင့် call to action ကို စကားပြောသံ script များအတွက်သာ ထည့်ပါ။';
      } else if (isInvestigative) {
        typeInstruction = 'အထူးစုံစမ်းတင်ပြချက်';
        styleGuide = `
အထူးစုံစမ်းသတင်းတင်ပြချက် (Investigative Report) ဖွဲ့စည်းပုံ:
- ခေါင်းစဉ် (Title)
- အကျဉ်းချုပ် (Executive Summary)
- နောက်ခံသတင်း (Background)
- သက်ဆိုင်ရာအချက်အလက်များ၊ သက်သေခံချက်များ၊ သက်ဆိုင်သူများ၏ သက်သေခံချက်များ
- သုတေသန၊ သတင်းအရင်းအမြစ်များ၊ သက်ဆိုင်ရာ စာရွက်စာတမ်းများ၊ Wikipedia၊ သုတေသနစာတမ်းများ၊ Google News၊ နိုင်ငံတကာသတင်း၊ မြန်မာသတင်းမီဒီယာ
- သတင်းအချက်အလက်များကို Google Fact Check နှင့် AP Fact Check ဖြင့် စစ်ဆေးပြီး ဖြစ်ကြောင်း footer တွင် disclaimer message (font size small) ဖြင့် ထည့်ပါ။
- အပိုဒ်ခွဲများအလိုက် စနစ်တကျရေးပါ။
`;
        extraPrompt = 'သတင်းအချက်အလက်များကို Google Fact Check နှင့် AP Fact Check ဖြင့် စစ်ဆေးပြီး ဖြစ်ကြောင်း footer တွင် disclaimer message (font size small) ဖြင့် ထည့်ပါ။';
      } else {
        // Blog post structure for all other tones/types
        typeInstruction = 'ဝဘ်ဆိုက်ပို့စ်အတွက်';
        styleGuide = `
Blog post ဖွဲ့စည်းပုံ:
- Title (မူရင်းသတင်း၏ ခေါင်းစဉ်)
- Author name (မူရင်းသတင်းရေးသားသူ)
- Original media name (မူရင်းသတင်းထုတ်ဝေသည့်မီဒီယာအမည်)
- Text body (သတင်းအကြောင်းအရာကို အပိုဒ်ခွဲများဖြင့် စနစ်တကျရေးပါ)
- အဆုံးတွင် Source links များထည့်ပါ။
- မင်္ဂလာပါ/မင်္ဂလာညနေခင်းပါ မထည့်ပါနှင့်။ Call to action မထည့်ပါနှင့်။
`;
        extraPrompt = 'Greeting နှင့် call to action မထည့်ပါနှင့်။ Blog post format ကို paragraph by paragraph ဖြင့်ရေးပါ။';
      }
  }
  const prompt = `အောက်ပါ မြန်မာသတင်းဆောင်းပါးအကြောင်းအရာကို မူရင်းအချက်အလက်များကိုသာ အသုံးပြု၍ ${typeInstruction} ${length} အတိုင်း ${toneInstruction} သံဖြင့် မြန်မာဘာသာဖြင့် ပြန်ဆိုရေးသားပါ။ မည်သည့်အချက်အလက်အသစ်မှ မထည့်ပါနှင့်။ မူရင်းအချက်အလက်များကိုသာ အသုံးပြုပါ။\n\n${extraPrompt}\n\nသတင်း script ကို အောက်ပါနမူနာပုံစံနှင့်ဖွဲ့စည်းပုံအတိုင်းသာရေးပါ။\n${styleGuide}\n\nသတင်းအကြောင်းအရာ:\n${content}`;
  const result = await makeGeminiRequest(prompt);
  return {
    script: result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '',
    sources,
    intermediateTranslation: undefined
  };
};

// Keyword input: Burmese only, use reputable sources, add fact-checking for investigative
export const generateScriptFromKeywords = async (
  keywords: string,
  length: ScriptLength,
  tone: ScriptTone,
  type: ScriptType
): Promise<GeneratedScriptResponse> => {
  // Detect if input is Burmese (Unicode range U+1000–U+109F)
  let burmeseKeywords = keywords;
  if (!/[\u1000-\u109F]/.test(keywords)) {
    // Translate English keywords to Burmese using Gemini
    const translationPrompt = `Translate the following keywords or phrases to Burmese language (မြန်မာဘာသာ):\n${keywords}`;
    const translationResult = await makeGeminiRequest(translationPrompt);
    burmeseKeywords = translationResult.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || keywords;
  }
  // Compose a prompt for Gemini to use latest news/facts from reputable sources
  const prompt = `အောက်ပါသော့ချက်စာလုံးများအရ မြန်မာဘာသာဖြင့် သတင်း script တစ်ပုဒ်ရေးပါ။
- နောက်ဆုံးရသတင်းများ၊ နိုင်ငံတကာနှင့် မြန်မာသတင်းမီဒီယာ (BBC, VOA, Reuters, AP, Mizzima, Irrawaddy, Myanmar Now, Eleven Media, Frontier Myanmar, The Irrawaddy, The Guardian, Google News, Wikipedia, University Research Papers, Scientific Reports) မှသာ အချက်အလက်များကို အသုံးပြုပါ။
- မည်သည့်အချက်အလက်အသစ်မှ မထည့်ပါနှင့်။
- သတင်းအချက်အလက်များကို Google Fact Check နှင့် AP Fact Check ဖြင့် စစ်ဆေးပြီး ဖြစ်ကြောင်း footer တွင် disclaimer message (font size small) ဖြင့် ထည့်ပါ။
- သတင်းအကြောင်းအရာကို အပိုဒ်ခွဲများဖြင့် စနစ်တကျရေးပါ။
- သတင်းအကြောင်းအရာ:
${burmeseKeywords}
- scriptLength: ${length}
- scriptTone: ${tone}
- scriptType: ${type}`;
  const result = await makeGeminiRequest(prompt);
  return {
    script: result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '',
    sources: [],
    intermediateTranslation: burmeseKeywords !== keywords ? burmeseKeywords : undefined
  };
};

// Function to perform translation and script generation (deprecated, now uses NewsAPI for facts)
export const performTranslationAndScriptGeneration = async (
  englishUrl: string,
  _length: ScriptLength, // unused but kept for API compatibility
  _tone: ScriptTone,     // unused but kept for API compatibility
  _type: ScriptType      // unused but kept for API compatibility
): Promise<GeneratedScriptResponse> => {
  // 1. Fetch the raw article content from the English news URL
  const corsProxy = 'https://api.allorigins.win/raw?url=';
  let articleContent = '';
  let sources: GroundingChunk[] = [];
  try {
    const response = await fetch(corsProxy + encodeURIComponent(englishUrl));
    if (!response.ok) {
      // Try fallback: fetch without proxy (for local dev or CORS-free URLs)
      try {
        const fallbackResponse = await fetch(englishUrl);
        if (fallbackResponse.ok) {
          const html = await fallbackResponse.text();
          const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          const body = match ? match[1] : html;
          articleContent = body.replace(/<script[\sS]*?<\/script>/gi, '')
            .replace(/<style[\sS]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          sources = [{ content: articleContent, url: englishUrl, title: englishUrl }];
        } else {
          throw new Error('Both proxy and direct fetch failed.');
        }
      } catch {
        throw new Error('Failed to fetch the news article from the provided URL (proxy and direct fetch failed).');
      }
    } else {
      const html = await response.text();
      const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const body = match ? match[1] : html;
      articleContent = body.replace(/<script[\sS]*?<\/script>/gi, '')
        .replace(/<style[\sS]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      sources = [{ content: articleContent, url: englishUrl, title: englishUrl }];
    }
  } catch (e) {
    throw new Error('Failed to fetch or parse the English news article. Please check the URL or try a different one.');
  }
  if (!articleContent || articleContent.length < 100) {
    throw new Error('The fetched news article is empty or too short. Please provide a valid English news article URL.');
  }
  // 2. Compose a prompt for Gemini to translate and rewrite in Burmese news reporting tone, web post structure
  let prompt = `Translate the following English news article into Burmese language in a news reporting tone, using a web post structure. Do not add any new information. Use only the original facts.\n\n---\n\n${articleContent}`;

  // If user selected "conversation" tone or "NEWS_SCRIPT" type, force narration tone for newscaster
  if (_tone === 'CONVERSATIONAL' || _type === 'NEWS_SCRIPT') {
    prompt = `Translate the following English news article into Burmese language in a narration tone suitable for a newscaster reporting the news. Use clear, formal, and engaging language as if reading the news on TV or radio. Do not add any new information. Use only the original facts.\n\n---\n\n${articleContent}`;
  }

  const result = await makeGeminiRequest(prompt);
  return {
    script: result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '',
    sources,
    intermediateTranslation: undefined
  };
};