import { deleteArticle, updateArticle } from '../Services/articleService';
import { useState } from 'react';
import './Article.css'

export default function Article({ article, onUpdate, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(article?.title || '');
  const [editBody, setEditBody] = useState(article?.body || '');

  const handleUpdate = async () => {
    if (!article) return;
    setLoading(true);

    if (!editTitle.trim() || !editBody.trim()) {
      alert("Both title and body must be provided.");
    }

    setLoading(true);

    try {
      const updated = {
        ...article,
        title: editTitle,
        body: editBody,
      };

      const result = await updateArticle(article.id, updated);
      onUpdate && onUpdate(result);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this article?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      await deleteArticle(article.id);
      onDelete && onDelete(article.id);
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!article) {
    return <p>No article selected</p>;
  }

  const formattedDate = article.updatedAt
    ? `Updated: ${article.updatedAt.toDate().toLocaleString()}`
    : `Posted: ${article.date.toDate().toLocaleString()}`;

  return (
    <article>
      <section>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Edit title"
            />
            <textarea
              rows={8}
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              placeholder="Edit body"
            />
            <button onClick={handleUpdate} disabled={loading}>Done</button>
            <button onClick={() => setIsEditing(false)} disabled={loading}>Cancel</button>
          </>
        ) : (
          <>
            <h2>{article.title}</h2>
            <p className="date">{formattedDate}</p>
            <p className="body">{article.body}</p>
            <button onClick={() => setIsEditing(true)} className='update'>UPDATE</button>
            <button onClick={handleDelete} disabled={loading}>DELETE</button>
          </>
        )}
      </section>
    </article>
  );
}