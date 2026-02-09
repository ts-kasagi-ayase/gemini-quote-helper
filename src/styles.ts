export const INJECTED_STYLES = `

  .custom-quote-canvas {
    margin: 0 auto 20px auto;
    width: 100%;
    user-select: text !important;
    -webkit-user-select: text !important;
    pointer-events: auto !important;
    position: relative;
    z-index: 1000;
    cursor: text;
  }

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
    user-select: none;
  }

  .quote-text {
    font-size: 14px;
    line-height: 1.5;
    color: #5f6368;
    user-select: text !important;
    -webkit-user-select: text !important;
    pointer-events: auto !important;
    position: relative;
    z-index: 1000;
    cursor: text;
    white-space: pre-wrap;
    word-break: break-word;
    flex: 1;
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

  [data-theme='dark'] .custom-quote-content,
  .dark .custom-quote-content {
    color: #AFAFAF !important;
    background: #2a2b2d !important;
  }

  [data-theme='dark'] .quote-icon,
  .dark .quote-icon {
    color: #a8c7fa !important;
  }

  [data-theme='dark'] .quote-text,
  .dark .quote-text {
    color: #e3e3e3 !important;
  }
`;
