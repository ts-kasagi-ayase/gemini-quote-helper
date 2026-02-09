import ReactDOM from 'react-dom/client';
import { FloatingButton } from '../components/FloatingButton';
import { QuotePreview } from '../components/QuotePreview';
import { formatBubble } from '../utils/domUtils';
import { INJECTED_STYLES } from '../styles';
import { ELEMENT_IDS, SELECTORS } from '../constants';

const inject = () => {
  // スタイル注入
  if (!document.getElementById(ELEMENT_IDS.STYLES)) {
    const style = document.createElement('style');
    style.id = ELEMENT_IDS.STYLES;
    style.innerHTML = INJECTED_STYLES;
    document.head.appendChild(style);
  }

  // FloatingButton注入
  if (!document.getElementById(ELEMENT_IDS.ROOT_BUTTON)) {
    const btnRoot = document.createElement('div');
    btnRoot.id = ELEMENT_IDS.ROOT_BUTTON;
    document.body.appendChild(btnRoot);
    ReactDOM.createRoot(btnRoot).render(<FloatingButton />);
  }

  // QuotePreview注入
  const inputContainer = document.querySelector(SELECTORS.INPUT_CONTAINER)
    || document.querySelector(`div:has(> ${SELECTORS.TEXT_INPUT})`);

  if (inputContainer && !document.getElementById(ELEMENT_IDS.ROOT_PREVIEW)) {
    const preRoot = document.createElement('div');
    preRoot.id = ELEMENT_IDS.ROOT_PREVIEW;
    inputContainer.prepend(preRoot);
    ReactDOM.createRoot(preRoot).render(<QuotePreview />);
  }

  // 既存のバブルをフォーマット
  document.querySelectorAll(SELECTORS.USER_QUERY_BUBBLE).forEach(el => formatBubble(el as HTMLElement));
};

const observer = new MutationObserver(inject);
observer.observe(document.body, { childList: true, subtree: true });
inject();