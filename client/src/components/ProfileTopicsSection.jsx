export default function ProfileTopicsSection({
  activeSection,
  topicsPostesRef,
  postedTopics,
  messages,
  setMessages
}) {
  const handleDeleteTopic = async (topicId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/topics/${topicId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      const updatedMessages = messages.filter(topic => topic._id !== topicId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Erreur lors de la suppression du topic :', error);
    }
  };

  return (
    <div 
      className={`content-section ${activeSection === 'topicsPostes' ? 'active' : ''}`}
      ref={topicsPostesRef}
    >
      <h2>Topics postés</h2>
      <div className="topics-list">
        {postedTopics.length > 0 ? (
          postedTopics.map(topic => (
            <div key={topic._id} className="topic-item">
              <h3>
                <a href={`/forum#topic-${topic._id}`} className="topic-link">
                  {topic.title}
                </a>
              </h3>
              <div className="topic-meta">Posté le : {new Date(topic.timestamp).toLocaleDateString()}</div>
              <button className="delete-topic-btn" onClick={() => handleDeleteTopic(topic._id)}>
                Supprimer
              </button>
            </div>
          ))
        ) : (
          <p>Aucun topic posté pour le moment.</p>
        )}
      </div>
    </div>
  );
}
