// components/CommentForm.js
import { useState } from 'react';

const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Répondre..."
        className="comment-input"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="comment-btn">Commenter</button>
    </form>
  );
};

export default CommentForm;
<<<<<<< HEAD
=======

>>>>>>> b7e54289206b0f2bdfcd640ed858865cd8364ee9
