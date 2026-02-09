import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

const FloatingButton = () => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const str = selection?.toString().trim();
      const anchorNode = selection?.anchorNode;
      if (!anchorNode) return;
      const parentElement = anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : anchorNode as HTMLElement;
      const isInsideResponse = parentElement?.closest('.model-response-text');
      if (str && isInsideResponse && selection.rangeCount > 0) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect) {
            setPos({ x: rect.left + rect.width / 2 + window.scrollX, y: rect.top + window.scrollY });
            setShow(true);
          }
        } catch (err) { }
      } else { setShow(false); }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  if (!show) return null;

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        const text = window.getSelection()?.toString().trim();
        if (text) {
          window.dispatchEvent(new CustomEvent('gemini-quote-event', { detail: text }));
          setShow(false);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute', left: `${pos.x}px`, top: `${pos.y - 10}px`,
        transform: 'translate(-50%, -100%)', zIndex: 2147483647,
        background: isHovered ? '#4285f4' : '#1a73e8',
        transition: 'background 0.2s ease',
        color: 'white', padding: '6px 16px', borderRadius: '20px',
        border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap'
      }}
    >
      Geminiに質問する
    </button>
  )
}

const getIsDark = () => {
  const bg = window.getComputedStyle(document.body).backgroundColor;
  const rgb = bg.match(/\d+/g);
  if (!rgb) return false;
  const [r, g, b] = rgb.map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

const formatBubble = (el: HTMLElement) => {
  if (el.dataset.quoteFormatted || el.closest('.custom-quote-canvas')) return;
  
  const raw = el.innerText;
  if (raw.includes('### 以下の内容を引用して質問します:')) {
    // """ で囲まれた引用部分を抽出
    const quoteMatch = raw.match(/"""([\s\S]*?)"""/);
    // 「### 質問:」より後の部分をすべて取得
    const parts = raw.split('### 質問:');
    
    // 引用：改行をスペースにして、前後をトリミング
    const quoteTxt = quoteMatch ? quoteMatch[1].replace(/\r?\n|\r/g, ' ').trim() : "";
    
    // 質問：ここが重要！前後の空白・改行を完全に消し去る
    const questionTxt = parts.length > 1 ? parts[1].trim() : "";

    const canvas = document.createElement('div');
    canvas.className = 'custom-quote-canvas';
    canvas.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: flex-start; pointer-events: auto;">
        <span style="color: #1a73e8; font-weight: bold; flex-shrink: 0; user-select: none;">↪</span>
        <div class="quote-text" style="font-size: 14px; line-height: 1.5; color: #969ba1;">${quoteTxt}</div>
      </div>
    `;

    const target = el.closest('.query-content');
    if (target?.parentNode) {
      target.parentNode.insertBefore(canvas, target);
    }

    // 書き戻す時に trim() された綺麗なテキストを入れる
    el.innerText = questionTxt; 
    el.dataset.quoteFormatted = "true";
  }
};

const QuotePreview = () => {
  const [text, setText] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleQuote = (e: any) => {
      setText(e.detail);
      setIsDark(getIsDark());
    };

    const mergeAndClear = () => {
      if (!text.trim()) return;
      const editor = document.querySelector('div[contenteditable="true"]') as HTMLElement;
      if (editor) {
        let currentContent = editor.innerText;
        const cleanUserMsg = currentContent.replace(/### 以下の内容を引用して質問します:[\s\S]*?### 質問:/g, "").trim();
        const finalPrompt = `### 以下の内容を引用して質問します:\n\n"""\n${text}\n"""\n\n### 質問:\n${cleanUserMsg}`;
        editor.focus();
        document.execCommand('selectAll', false);
        document.execCommand('insertText', false, finalPrompt);
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        setText('');
      }
    };

    const handleSendClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const sendBtn = target.closest('button[aria-label*="送信"], button[aria-label*="Send"], .send-button, button:has(svg)');
      if (sendBtn) mergeAndClear();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) mergeAndClear();
    };

    window.addEventListener('gemini-quote-event', handleQuote);
    document.addEventListener('click', handleSendClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('gemini-quote-event', handleQuote);
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

const inject = () => {
  if (!document.getElementById('custom-quote-styles')) {
    
    const style = document.createElement('style');
    style.id = 'custom-quote-styles';
    style.innerHTML = `
      .custom-quote-container {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
        align-items: flex-start;
      }
      .quote-icon {
        font-weight: bold;
        flex-shrink: 0;
        font-size: 1.1em;
        color: #1a73e8;
      }
      .custom-quote-content {
        color: #5F6368; 
        font-size: 0.85em; 
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-all;
        background: #f0f4f9;
        padding: 8px 12px;
        border-radius: 8px;
      }

      .custom-quote-canvas, 
      .quote-text {
        /* 1. 選択を強制許可 */
        margin: 0 auto 12px auto;
        user-select: text !important;
        -webkit-user-select: text !important;
        
        /* 2. マウス操作を拒否させない */
        pointer-events: auto !important;
        
        /* 3. 重なり順を上げて、透明なレイヤーより手前に出す */
        position: relative;
        z-index: 1000;
        
        /* 4. カーソルをテキスト選択用にする */
        cursor: text;
      }

      [data-theme='dark'] .custom-quote-content, .dark .custom-quote-content {
        color: #AFAFAF !important;
        background: #2a2b2d !important;
      }
      [data-theme='dark'] .quote-icon, .dark .quote-icon {
        color: #a8c7fa !important;
      }
    `;
    
    document.head.appendChild(style);
  }


  if (!document.getElementById('root-button')) {
    const btnRoot = document.createElement('div');
    btnRoot.id = 'root-button';
    document.body.appendChild(btnRoot);
    ReactDOM.createRoot(btnRoot).render(<FloatingButton />);
  }

  const inputContainer = document.querySelector('.input-area-container, .text-input-field-container, .input-field-container')
    || document.querySelector('div:has(> .text-input-field)');

  if (inputContainer && !document.getElementById('root-preview')) {
    const preRoot = document.createElement('div');
    preRoot.id = 'root-preview';
    inputContainer.prepend(preRoot);
    ReactDOM.createRoot(preRoot).render(<QuotePreview />);
  }

  document.querySelectorAll('.user-query-bubble-with-background, [class*="user-query-bubble"]').forEach(el => formatBubble(el as HTMLElement));
};

const observer = new MutationObserver(inject);
observer.observe(document.body, { childList: true, subtree: true });
inject();