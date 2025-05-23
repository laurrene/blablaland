import React, { useRef, useState } from 'react';
import '../styles/TopicForm.css';

// Formulaire de création/modification de sujet avec éditeur riche
const TopicForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [activeFormats, setActiveFormats] = useState([]);
  const editorRef = useRef(null);

  // Applique ou retire un format (gras, italique, etc.)
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

  // Gère la validation du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editorRef.current.innerHTML;
    if (title.trim() && content.trim()) {
      onSubmit({ title, content });
      setTitle('');
      editorRef.current.innerHTML = '';
      setActiveFormats([]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          placeholder="Contenu du message..."
          onInput={() => {}}
          suppressContentEditableWarning={true}
        />
      </div>

      <div className="modal-actions">
        <button type="submit">Publier</button>
        <button type="button" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
};

export default TopicForm;
