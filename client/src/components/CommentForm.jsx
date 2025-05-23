import { useState } from 'react';

const CommentForm = ({ onSubmit }) => {
  // État local pour le texte du commentaire
  const [comment, setComment] = useState('');

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);  // Appel du callback parent avec le commentaire
      setComment('');     // Réinitialisation du champ
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {/* Champ texte pour saisir un commentaire */}
      <input
        type="text"
        placeholder="Répondre..."
        className="comment-input"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {/* Bouton pour envoyer le commentaire */}
      <button type="submit" className="comment-btn">Commenter</button>
    </form>
  );
};

export default CommentForm;
