import React, { useRef, useState } from 'react';

const PostModal = ({ showModal, setShowModal, title, setTitle, message, setMessage, handlePost, activeFormats, setActiveFormats }) => {
  const editorRef = useRef(null);

  const toggleFormat = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (command === 'blockquote') {
      const isBlockquote = document.queryCommandValue('formatBlock') === 'blockquote';
      document.execCommand('formatBlock', false, isBlockquote ? 'div' : 'blockquote');
      setActiveFormats((prev) =>
        isBlockquote ? prev.filter((c) => c !== command) : [...prev, command]
      );
      return;
    }
    const isActive = document.queryCommandState(command);
    document.execCommand(command, false, null);
    setActiveFormats((prev) =>
      isActive ? prev.filter((c) => c !== command) : [...prev, command]
    );
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Créer un nouveau sujet</h2>
        <form onSubmit={handlePost}>
          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              type="text"
              id="title"
              className="title-input"
              placeholder="Titre du sujet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="editor-container">
            <div className="editor-toolbar">
              <button type="button" className={activeFormats.includes('bold') ? 'active' : ''} onClick={() => toggleFormat('bold')}><b>B</b></button>
              <button type="button" className={activeFormats.includes('italic') ? 'active' : ''} onClick={() => toggleFormat('italic')}><i>I</i></button>
              <button type="button" className={activeFormats.includes('strikeThrough') ? 'active' : ''} onClick={() => toggleFormat('strikeThrough')}><s>S</s></button>
              <button type="button" className={activeFormats.includes('blockquote') ? 'active' : ''} onClick={() => toggleFormat('blockquote')}>“”</button>
              <button type="button" onClick={() => document.execCommand('insertUnorderedList')}>•</button>
              <button type="button" onClick={() => document.execCommand('insertOrderedList')}>1.</button>
            </div>
            <div
              className="editor"
              contentEditable
              ref={editorRef}
              onInput={() => setMessage(editorRef.current.innerHTML)}
              placeholder="Contenu du message..."
              suppressContentEditableWarning={true}
            />
          </div>

          <div className="modal-actions">
            <button type="submit">Publier</button>
            <button type="button" onClick={() => setShowModal(false)}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;