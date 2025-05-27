export const DEBOUNCE_DELAY = 500; // ms

export const UI_STRINGS_MY = {
  // App Title
  APP_TITLE: 'မြန်မာသတင်း ရေးသားသူ',
  
  // Input Mode Tabs
  FILE_UPLOAD_TAB: 'ဖိုင်တင်ရန်',
  URL_INPUT_TAB: 'URL',
  KEYWORD_SEARCH_TAB: 'သော့ချက်စာလုံးများ',
  TRANSLATE_DEVELOP_TAB: 'ဘာသာပြန်ရေးသား',
  
  // File Upload
  UPLOAD_PROMPT_LABEL: 'အကြောင်းအရာ ဖိုင်ကို ရွေးချယ်ပါ',
  UPLOAD_BUTTON_TEXT: 'ဖိုင်ရွေးရန်',
  FILE_SELECTED_PREFIX: 'ရွေးချယ်ထားသော ဖိုင် - ',
  NO_FILE_SELECTED: 'ဖိုင်မရွေးချယ်ရသေးပါ',
  LOADING: 'တင်နေသည်',
  
  // URL Input
  ENTER_URL_PROMPT: 'သတင်းဆောင်းပါး URL ထည့်သွင်းပါ',
  ENTER_ENGLISH_URL_PROMPT: 'အင်္ဂလိပ်ဘာသာ သတင်းဆောင်းပါး URL ထည့်သွင်းပါ',
  URL_PLACEHOLDER: 'https://example.com/news-article',
  
  // Keywords Input
  ENTER_KEYWORDS_PROMPT: 'သော့ချက်စာလုံးများ ထည့်သွင်းပါ',
  KEYWORDS_PLACEHOLDER: 'အရေးကြီးစကားလုံးများကို ကော်မာဖြင့်ခြားထည့်ပါ',
  
  // Script Length
  SCRIPT_LENGTH_LABEL: 'ရေးသားမည့် အရှည်အတိုအတိုင်းအတာ',
  LENGTH_SHORT: 'တိုတောင်း',
  LENGTH_STANDARD: 'သာမန်',
  LENGTH_DETAILED: 'အသေးစိတ်',
  
  // Script Tone
  SCRIPT_TONE_LABEL: 'ရေးသားပုံ',
  TONE_FORMAL: 'တရားဝင်',
  TONE_CONVERSATIONAL: 'ပြောဆိုသကဲ့သို့',
  TONE_SIMPLIFIED: 'ရိုးရှင်း',
  
  // Script Type
  SCRIPT_TYPE_LABEL: 'အမျိုးအစား',
  TYPE_WEB_POST: 'ဝဘ်ဆိုက်ပို့စ်',
  TYPE_NEWS_SCRIPT: 'သတင်းဖတ်ကြားရန်',
  TYPE_SOCIAL_MEDIA: 'လူမှုမီဒီယာ',
  
  // Buttons
  GENERATE_SCRIPT_BUTTON: 'သတင်းရေးသား',
  GENERATING_SCRIPT_BUTTON: 'ရေးသားနေသည်...',
  TRANSLATING_AND_GENERATING_BUTTON: 'ဘာသာပြန်နှင့် ရေးသားနေသည်...',
  DOWNLOAD_SCRIPT_BUTTON: 'သတင်းမူကြမ်းကို ဒေါင်းလုဒ်ယူရန်',
  
  // Headings
  SCRIPT_HEADING: 'ရေးသားပြီး သတင်းမူကြမ်း',
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