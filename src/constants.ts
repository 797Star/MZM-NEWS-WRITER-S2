export const DEBOUNCE_DELAY = 500; // ms

export const UI_STRINGS_MY = {
  // App Title
  APP_TITLE: 'သတင်းရေးသားခြင်းထောက်ကူစနစ်',
  
  // Input Mode Tabs
  FILE_UPLOAD_TAB: 'ဖိုင်တင်ရန်',
  URL_INPUT_TAB: 'URL',
  KEYWORD_SEARCH_TAB: 'Keyword ဖြင့်ရေးသားရန်',
  TRANSLATE_DEVELOP_TAB: 'ဘာသာပြန်ရေးသားရန်',
  
  // File Upload
  UPLOAD_PROMPT_LABEL: 'သတင်းရေးသားရန်အချက်အလက်ပါသော စာဖိုင် (.txt, .pdf, .docx) ကိုရွေးချယ်ပါ',
  UPLOAD_BUTTON_TEXT: 'ဖိုင်ရွေးရန်',
  FILE_SELECTED_PREFIX: 'ရွေးချယ်ထားသောဖိုင် - ',
  NO_FILE_SELECTED: 'ဖိုင်မရွေးချယ်ရသေးပါ',
  LOADING: 'တင်နေသည်',
  
  // URL Input
  ENTER_URL_PROMPT: 'မြန်မာသတင်း URL ထည့်သွင်းပါ',
  ENTER_ENGLISH_URL_PROMPT: 'အင်္ဂလိပ်သတင်း URL ထည့်သွင်းပါ',
  URL_PLACEHOLDER: 'https://example.com/news-article',
  
  // Keywords Input
  ENTER_KEYWORDS_PROMPT: 'Keyword ထည့်သွင်းပါ',
  KEYWORDS_PLACEHOLDER: 'Keywordများကို ကော်မာဖြင့်ခြားထည့်ပါ',
  
  // Script Length
  SCRIPT_LENGTH_LABEL: 'သတင်းအမျိုးအစား',
  LENGTH_SHORT: 'သတင်းတို',
  LENGTH_STANDARD: 'ပုံမှန်သတင်း',
  LENGTH_LONG: 'သတင်းရှည်',
  LENGTH_DETAILED: 'စုံစမ်းဖော်ထုတ်သတင်း',
  LENGTH_ANALYTICAL: 'သတင်းသုံးသပ်ချက်',
  LENGTH_FEATURE: 'သတင်းအထူးအစီအစဉ်',

  
  // Script Tone
  SCRIPT_TONE_LABEL: 'သတင်းရေးသားဟန်',
  TONE_FORMAL: 'နေ့စဥ်သတင်း',
  TONE_CONVERSATIONAL: 'စကားပြော',
  TONE_SIMPLIFIED: 'သတင်းကောက်စာ',
  
  // Script Type
  SCRIPT_TYPE_LABEL: 'သတင်းတင်မည့်အမျိုးအစား',
  TYPE_WEB_POST: 'ဝက်ဆိုဒ် တင်ရန်(Web post)',
  TYPE_NEWS_SCRIPT: 'ဗီဒီယို ထုတ်ရန် (Video post)',
  TYPE_SOCIAL_MEDIA: 'Social Media တင်ရန်',
  
  // Buttons
  GENERATE_SCRIPT_BUTTON: 'ရေးသားပါ',
  GENERATING_SCRIPT_BUTTON: 'ရေးသားနေသည်...',
  TRANSLATING_AND_GENERATING_BUTTON: 'ဘာသာပြန်သတင်း ရေးသားနေသည်...',
  DOWNLOAD_SCRIPT_BUTTON: 'သတင်းစာဖိုင်ကို ဒေါင်းလုဒ်ယူရန်',
  
  // Headings
  SCRIPT_HEADING: 'ရေးသားပြီး သတင်းစာ',
  SOURCES_HEADING: 'ကိုးကားချက်များ',
  INTERMEDIATE_TRANSLATION_HEADING: 'ဘာသာပြန်ဆိုထားသော အကြောင်းအရာ',
  DISCLAIMER_HEADING: 'အသိပေးချက်',
  
  // Messages
  NO_SCRIPT_YET: 'သတင်းမူကြမ်း ရေးသားရန် အထက်မှ ညွှန်ကြားချက်များကို လိုက်နာပါ။',
  DISCLAIMER_CONTENT: 'ဤစနစ်မှ ထုတ်လုပ်သော အကြောင်းအရာများသည် AI မှ ထုတ်လုပ်ထားခြင်းဖြစ်ပါသည်။ ဆောင်းပါးများကို မထုတ်ဝေမီ ပြန်လည်စစ်ဆေးရန် အကြံပြုပါသည်။',
  
  // Errors
  ERROR_API_KEY_MISSING: 'API ကီး မတွေ့ရှိပါ။ API ကီးကို .env ဖိုင်တွင် ထည့်သွင်းပါ သို့မဟုတ် စီမံခန့်ခွဲသူထံ ဆက်သွယ်ပါ။',
  ERROR_NO_INPUT: 'ထည့်သွင်းမှု မရှိပါ',
  ERROR_GENERATING_SCRIPT: 'သတင်းမူကြမ်း ရေးသားရာတွင် အမှားအယွင်းဖြစ်ပွားခဲ့သည်',
  ERROR_FILE_READ: 'ဖိုင်ဖတ်ရှုရာတွင် အမှားအယွင်းဖြစ်ပွားခဲ့သည်',
  ERROR_FILE_PARSE: 'ဖိုင်ဖွင့်ရာတွင် အမှားအယွင်းဖြစ်ပွားခဲ့သည်',
  ERROR_UNSUPPORTED_FILE_TYPE: 'ထောက်ပံ့မထားသော ဖိုင်အမျိုးအစား။ txt, pdf, docx ဖိုင်များကိုသာ အသုံးပြုနိုင်ပါသည်။',
};