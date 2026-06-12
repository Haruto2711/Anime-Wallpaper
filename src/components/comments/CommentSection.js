import React from 'react';
import Card from 'react-bootstrap/Card';
import { Star } from 'lucide-react';
import CommentForm from './CommentForm';

function CommentSection({ comments, onSubmitComment }) {
  // Format date helper
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="text-white mt-4">
      <h3 className="mb-4 border-bottom border-secondary pb-2">Bình luận & Đánh giá ({comments.length})</h3>
      
      {/* Comment Form */}
      <CommentForm onSubmitComment={onSubmitComment} />

      {/* Comment List */}
      <div className="d-flex flex-column gap-3">
        {comments.length === 0 ? (
          <p className="text-muted text-center py-4">Chưa có bình luận nào. Hãy là người đầu tiên đánh giá hình nền này!</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id || Math.random()} className="bg-dark border-secondary">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <strong className="text-light">{comment.author}</strong>
                    <span className="text-muted ms-2" style={{ fontSize: '0.8rem' }}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <div className="d-flex gap-0.5 text-warning">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={comment.rating >= star ? "#ffc107" : "none"}
                        color={comment.rating >= star ? "#ffc107" : "#6c757d"}
                      />
                    ))}
                  </div>
                </div>
                <Card.Text className="text-white-50 m-0" style={{ whiteSpace: 'pre-line' }}>
                  {comment.content}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
