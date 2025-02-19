import React from 'react';
import { useEditor } from '../../contexts/editorContext.jsx';
import '../../index.css';

const placeCursorTextEnd = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
};

const Editor = ({ height = '300px' }) => {
  const { editorRef, wordCount, charCount } = useEditor();

  return (
    <>
      {/* main editor */}
      <div
        ref={editorRef}
        contentEditable
        className="editor-content"
        onFocus={() => placeCursorTextEnd(editorRef.current)}
        style={{
          minHeight: height,
          padding: '10px',
          overflowY: 'auto',
        }}
      />
      {/* footer */}
      <div className="editor-footer">
        <span>Words: {wordCount}</span> | <span>Chars: {charCount}</span>
      </div>
    </>
  );
};

export default Editor;
