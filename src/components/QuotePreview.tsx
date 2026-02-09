import { useState, useEffect } from 'react';
import { QUOTE_EVENT, QUOTE_MARKER_START, QUOTE_MARKER_END, QUOTE_DELIMITER, SELECTORS } from '../constants';
import { getIsDark } from '../utils/domUtils';

export const QuotePreview = () => {
  const [text, setText] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleQuote = (e: any) => {
      setText(e.detail);
      setIsDark(getIsDark());
    };

    const mergeAndClear = () => {
      if (!text.trim()) return;
      const editor = document.querySelector(SELECTORS.EDITOR) as HTMLElement;
      if (editor) {
        let currentContent = editor.innerText;
        let cleanUserMsg = currentContent
          .replace(/### 以下の内容を引用して質問します:[\s\S]*?### 質問:/g, "")
          .replace(/\n{2,}/g, '\n');
        
          if (cleanUserMsg.startsWith('\n')) {
          cleanUserMsg = cleanUserMsg.substring(1);
        }
        
        const finalPrompt = `${QUOTE_MARKER_START}\n\n${QUOTE_DELIMITER}\n${text}\n${QUOTE_DELIMITER}\n\n${QUOTE_MARKER_END}\n${cleanUserMsg}`;
        
        editor.focus();
        document.execCommand('selectAll', false);
        document.execCommand('insertText', false, finalPrompt);
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        setText('');
      }
    };

    const handleSendClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const sendBtn = target.closest(SELECTORS.SEND_BUTTON);
      if (sendBtn) mergeAndClear();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) mergeAndClear();
    };

    window.addEventListener(QUOTE_EVENT, handleQuote);
    document.addEventListener('click', handleSendClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener(QUOTE_EVENT, handleQuote);
      document.removeEventListener('click', handleSendClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [text]);

  if (!text.trim()) return null;

  const styles = {
    bg: isDark ? '#1e1f20' : '#f0f4f9',
    border: isDark ? '#444746' : '#c4c7c5',
    text: isDark ? '#e3e3e3' : '#444746',
    accent: isDark ? '#a8c7fa' : '#1a73e8'
  };

  return (
    <div style={{
      width: '100%',
      backgroundColor: styles.bg,
      color: styles.text,
      border: `1px solid ${styles.border}`,
      padding: '12px 20px',
      borderRadius: '16px',
      display: 'flex',
      boxSizing: 'border-box',
      marginBottom: '8px',
      position: 'relative',
      zIndex: 1000,
      overflow: 'hidden',
      alignItems: 'flex-start'
    }}>
      <div style={{ display: 'flex', gap: '12px', width: '100%', fontSize: '13px', alignItems: 'flex-start' }}>
        <div style={{ color: styles.accent, fontSize: '18px', fontWeight: 'bold', lineHeight: '1.2' }}>↪</div>
        <div style={{
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: styles.text 
        }}>
          {text}
        </div>
      </div>
      <button
        onClick={() => setText('')}
        style={{ cursor: 'pointer', border: 'none', background: 'none', color: 'inherit', opacity: 0.7, marginLeft: '8px' }}
      >
        ✕
      </button>
    </div>
  );
};
