import React, { useRef, useState } from 'react';
import '../styles/TopicForm.css';

// Composant de formulaire pour créer/modifier un sujet avec éditeur de text
const TopicForm = ({ onSubmit, onCancel }) => {
  // État pour le titre du sujet
  const [title, setTitle] = useState('');
  // État pour suivre les formats de texte actifs (gras, italique, etc.)
  const [activeFormats, setActiveFormats] = useState([]);
  // Référence pour accéder à l'élément éditable (contentEditable)
  const editorRef = useRef(null);

  // Basculer un format de texte dans l'éditeur
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

    // Pour les autres commandes (bold, italic, etc.)
    const isActive = document.queryCommandState(command);
    document.execCommand(command, false, null);
    setActiveFormats((prev) =>
      isActive ? prev.filter((c) => c !== command) : [...prev, command]
    );
  };

  // Gère la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editorRef.current.innerHTML;

    // Valide que le titre et le contenu ne sont pas vides
    if (title.trim() && content.trim()) {
      onSubmit({ title, content }); 
      setTitle('');
      editorRef.current.innerHTML = '';
      setActiveFormats([]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Champ pour le titre */}
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

      {/* Éditeur de texte enrichi */}
      <div className="editor-container">
        <div className="editor-toolbar">
          <button type="button" className={activeFormats.includes('bold') ? 'active' : ''} onClick={() => toggleFormat('bold')}><b>B</b></button>
          <button type="button" className={activeFormats.includes('italic') ? 'active' : ''} onClick={() => toggleFormat('italic')}><i>I</i></button>
          <button type="button" className={activeFormats.includes('strikeThrough') ? 'active' : ''} onClick={() => toggleFormat('strikeThrough')}><s>S</s></button>
          <button type="button" className={activeFormats.includes('blockquote') ? 'active' : ''} onClick={() => toggleFormat('blockquote')}>“”</button>
          <button type="button" onClick={() => document.execCommand('insertUnorderedList')}>•</button>
          <button type="button" onClick={() => document.execCommand('insertOrderedList')}>1.</button>
        </div>
        {/* Zone éditable  */}
        <div
          className="editor"
          contentEditable
          ref={editorRef}
          placeholder="Contenu du message..."
          onInput={() => {}}
          suppressContentEditableWarning={true}
        />
      </div>

      {/* Boutons d'action */}
      <div className="modal-actions">
        <button type="submit">Publier</button>
        <button type="button" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
};

export default TopicForm;