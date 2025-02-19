import { useCallback, useState, useEffect } from 'react';

export const useEditorFormatting = (editorRef) => {
  const [activeStyles, setActiveStyles] = useState(['justifyLeft']); // Set initial justifyLeft

  const updateDataAttributes = useCallback((element) => {
    const styles = window.getComputedStyle(element);
    const dataType = [];

    if (styles.fontWeight === 'bold' || parseInt(styles.fontWeight) >= 600)
      dataType.push('bold');
    if (styles.fontStyle === 'italic') dataType.push('italic');
    if (styles.textDecoration.includes('underline')) dataType.push('underline');
    if (styles.textAlign === 'left') dataType.push('justifyLeft');
    if (styles.textAlign === 'center') dataType.push('justifyCenter');
    if (styles.textAlign === 'right') dataType.push('justifyRight');

    element.setAttribute('data-type', dataType.join('-') || 'normal');
  }, []);

  const updateActiveStyles = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      const styles = new Set();
      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const parentElement =
          range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentElement
            : range.commonAncestorContainer;

        const computedStyle = window.getComputedStyle(parentElement);
        const fontWeight = computedStyle.fontWeight;
        const fontStyle = computedStyle.fontStyle;
        const textDecoration = computedStyle.textDecoration;

        // Check text formatting
        if (fontWeight === 700) styles.add('bold');
        if (fontStyle === 'italic') styles.add('italic');
        if (textDecoration === 'underline') styles.add('underline');

        let node = parentElement;
        while (node && node !== document) {
          if (node.tagName === 'OL') {
            styles.add('orderedList');
          }
          if (node.tagName === 'UL') {
            styles.add('unorderedList');
          }
          if (node.tagName === 'SUP') {
            styles.add('superscript');
          }
          if (node.tagName === 'SUB') {
            styles.add('subscript');
          }
          node = node.parentNode;
        }

        // Check justification (only one can be active)
        const textAlign = computedStyle.textAlign;
        if (textAlign === 'left' || textAlign === 'start') {
          styles.add('justifyLeft');
        } else if (textAlign === 'center') {
          styles.add('justifyCenter');
        } else if (textAlign === 'right') {
          styles.add('justifyRight');
        }
      }

      setActiveStyles(Array.from(styles));
    }
  }, [editorRef]);

  const formatText = useCallback(
    (command, value = null) => {
      const editor = editorRef.current;
      if (editor) {
        if (command.startsWith('justify')) {
          // Remove all justify styles before applying the new one
          ['justifyLeft', 'justifyCenter', 'justifyRight'].forEach((style) => {
            if (style !== command) {
              document.execCommand(style, false, null);
            }
          });
        } else if (
          command === 'insertOrderedList' ||
          command === 'insertUnorderedList'
        ) {
          // Remove the other list style before applying the new one
          const otherListCommand =
            command === 'insertOrderedList'
              ? 'insertUnorderedList'
              : 'insertOrderedList';
          if (document.queryCommandState(otherListCommand)) {
            document.execCommand(otherListCommand, false, null);
          }
        } else if (command === 'superscript' || command === 'subscript') {
          // Remove the other script style before applying the new one
          const otherScriptCommand =
            command === 'superscript' ? 'subscript' : 'superscript';
          if (document.queryCommandState(otherScriptCommand)) {
            document.execCommand(otherScriptCommand, false, null);
          }
        }

        document.execCommand(command, false, value);
        updateActiveStyles();
        editor.dispatchEvent(new Event('change'));
      }
    },
    [editorRef, updateActiveStyles],
  );

  const addImageOrVideo = useCallback(
    (file, fileUrl) => {
      const editor = editorRef.current;
      if (editor) {
        let element;
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (file.type.startsWith('image/')) {
              element = document.createElement('img');
              element.src = e.target.result;
              element.alt = file.name;
            } else if (file.type.startsWith('video/')) {
              element = document.createElement('video');
              element.src = e.target.result;
              element.controls = true;
            }
            editor.appendChild(element);
            editor.appendChild(document.createElement('br'));
            updateActiveStyles();
          };
          reader.readAsDataURL(file);
        } else if (fileUrl) {
          if (fileUrl.match(/\.(jpeg|jpg|gif|png)$/)) {
            element = document.createElement('img');
            element.src = fileUrl;
            element.alt = 'Inserted image';
          } else if (fileUrl.match(/\.(mp4|webm|ogg)$/)) {
            element = document.createElement('video');
            element.src = fileUrl;
            element.controls = true;
          }
          editor.appendChild(element);
          editor.appendChild(document.createElement('br'));
          updateActiveStyles();
        }
      }
    },
    [editorRef, updateActiveStyles],
  );

  const addLink = useCallback(
    (linkText, linkUrl, range = null) => {
      const editor = editorRef.current;
      const selection = window.getSelection();
      if (editor) {
        // Focus the editor to ensure the link is inserted at the right position
        editor.focus();

        // Create an anchor element instead of button
        const linkElement = document.createElement('a');
        linkElement.textContent = linkText;
        linkElement.href = linkUrl;
        linkElement.rel = 'noopener noreferrer'; // Prevent security issues
        linkElement.className = 'sg-link';
        if (range) {
          range.deleteContents();
          range.insertNode(linkElement);
          range.setStartAfter(linkElement);
          range.setEndAfter(linkElement);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editor.appendChild(linkElement);
        }
        updateActiveStyles();
      }
    },
    [editorRef, updateActiveStyles],
  );

  const applyHeading = useCallback(
    (heading) => {
      const editor = editorRef.current;
      if (editor) {
        // Use execCommand to change the format block to the specified heading
        document.execCommand('formatBlock', false, heading);

        // Update active styles to reflect the changes
        updateActiveStyles();
      }
    },
    [editorRef, updateActiveStyles],
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      // Handle link clicks to open them in a new tab
      const handleLinkClick = (e) => {
        const target = e.target;
        // The element that was clicked is checked to see if it’s an <a> (anchor) tag.
        if (target.tagName === 'A') {
          e.preventDefault(); // Prevent default editing behavior
          window.open(target.href, '_blank', 'noopener,noreferrer'); // Open the link in a new tab
        }
      };

      editor.addEventListener('keyup', updateActiveStyles);
      editor.addEventListener('mouseup', updateActiveStyles);
      // Attach the click event listener to the editor for anchor elements
      editor.addEventListener('click', handleLinkClick);

      // Cleanup event listeners when the component unmounts or the editor changes
      return () => {
        editor.removeEventListener('keyup', updateActiveStyles);
        editor.removeEventListener('mouseup', updateActiveStyles);
        editor.removeEventListener('click', handleLinkClick);
      };
    }
  }, [editorRef, updateActiveStyles]);

  return {
    formatText,
    updateDataAttributes,
    addImageOrVideo,
    addLink,
    applyHeading,
    activeStyles,
  };
};
