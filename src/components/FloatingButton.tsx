import { useState, useEffect } from 'react';
import { QUOTE_EVENT, SELECTORS } from '../constants';

export const FloatingButton = () => {
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
      const isInsideResponse = parentElement?.closest(SELECTORS.MODEL_RESPONSE);
      if (str && isInsideResponse && selection.rangeCount > 0) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect) {
            setPos({ x: rect.left + rect.width / 2 + window.scrollX, y: rect.top + window.scrollY });
            setShow(true);
          }
        } catch (err) { }
      } else { 
        setShow(false); 
      }
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
          window.dispatchEvent(new CustomEvent(QUOTE_EVENT, { detail: text }));
          setShow(false);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: `${pos.x}px`,
        top: `${pos.y - 10}px`,
        transform: 'translate(-50%, -100%)',
        zIndex: 2147483647,
        background: isHovered ? '#4285f4' : '#1a73e8',
        transition: 'background 0.2s ease',
        color: 'white',
        padding: '6px 16px',
        borderRadius: '20px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap'
      }}
    >
      Geminiに質問する
    </button>
  );
};
