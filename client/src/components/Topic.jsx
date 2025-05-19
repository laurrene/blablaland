import React from 'react';
import CommentForm from './CommentForm';

const Topic = ({ msg, onComment }) => {
  return (
    <div className="message-thread">
      <div className="main-message">
        <h3 className="topic-title">{msg.title}</h3>
        <div className="meta">
          {msg.user} – {msg.timestamp.toLocaleString()}
        </div>
        <div>{msg.content}</div>
      </div>

      <div className="comments-thread">
        {msg.comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="meta">
              {comment.user} – {comment.timestamp.toLocaleString()}
            </div>
            <div>{comment.content}</div>
          </div>
        ))}

        <CommentForm onSubmit={(text) => onComment(msg.id, text)} />
      </div>
    </div>
  );
};

export default Topic;
