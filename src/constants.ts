export const QUOTE_EVENT = 'gemini-quote-event';
export const QUOTE_MARKER_START = '### 以下の内容を引用して質問します:';
export const QUOTE_MARKER_END = '### 質問:';
export const QUOTE_DELIMITER = '"""';

export const SELECTORS = {
  EDITOR: 'div[contenteditable="true"]',
  SEND_BUTTON: 'button[aria-label*="送信"], button[aria-label*="Send"], .send-button, button:has(svg)',
  INPUT_CONTAINER: '.input-area-container, .text-input-field-container, .input-field-container',
  TEXT_INPUT: '.text-input-field',
  USER_QUERY_BUBBLE: '.user-query-bubble-with-background, [class*="user-query-bubble"]',
  QUERY_CONTENT: '.query-content',
  QUOTE_CANVAS: '.custom-quote-canvas',
  MODEL_RESPONSE: '.model-response-text',
} as const;

export const ELEMENT_IDS = {
  STYLES: 'custom-quote-styles',
  ROOT_BUTTON: 'root-button',
  ROOT_PREVIEW: 'root-preview',
} as const;
