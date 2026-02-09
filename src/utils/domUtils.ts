import { QUOTE_MARKER_START, QUOTE_MARKER_END, QUOTE_DELIMITER, SELECTORS } from '../constants';

export const getIsDark = (): boolean => {
  const bg = window.getComputedStyle(document.body).backgroundColor;
  const rgb = bg.match(/\d+/g);
  if (!rgb) return false;
  const [r, g, b] = rgb.map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

export const formatBubble = (el: HTMLElement): void => {
  if (el.dataset.quoteFormatted || el.closest(SELECTORS.QUOTE_CANVAS)) return;
  
  const raw = el.innerText;
  if (!raw.includes(QUOTE_MARKER_START)) return;

  const quoteMatch = raw.match(new RegExp(`${QUOTE_DELIMITER}([\\s\\S]*?)${QUOTE_DELIMITER}`));
  const parts = raw.split(QUOTE_MARKER_END);
  
  const quoteTxt = quoteMatch ? quoteMatch[1].replace(/\r?\n|\r/g, ' ').trim() : "";
  
  const questionTxt = parts.length > 1 ? parts[1].trim() : "";

  const canvas = document.createElement('div');
  canvas.className = 'custom-quote-canvas';
  canvas.innerHTML = `
    <div style="display: flex; gap: 10px; align-items: flex-start; pointer-events: auto;">
      <span style="color: #1a73e8; font-weight: bold; flex-shrink: 0; user-select: none;">↪</span>
      <div class="quote-text">${quoteTxt}</div>
    </div>
  `;

  const target = el.closest(SELECTORS.QUERY_CONTENT);
  if (target?.parentNode) {
    target.parentNode.insertBefore(canvas, target);
  }

  el.textContent = questionTxt;
  el.style.whiteSpace = 'pre-wrap';
  
  el.dataset.quoteFormatted = "true";
};
