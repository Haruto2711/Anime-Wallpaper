import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Star } from 'lucide-react';

function CommentForm({ onSubmitComment }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      setError('Vui lòng điền đầy đủ tên và nội dung bình luận.');
      return;
    }
    setError('');
    onSubmitComment({
      author: author.trim(),
      content: content.trim(),
      rating: rating,
      createdAt: new Date().toISOString()
    });
    setAuthor('');
    setContent('');
    setRating(5);
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 bg-dark border border-secondary rounded text-white mb-4">
      <h5 className="mb-3">Viết đánh giá của bạn</h5>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3" controlId="formCommentAuthor">
        <Form.Label>Tên của bạn</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập tên..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="bg-secondary text-white border-secondary placeholder-light"
          style={{ backgroundColor: '#212529 !important' }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formCommentRating">
        <Form.Label className="d-block">Đánh giá sao</Form.Label>
        <div className="d-flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
              className={(hoverRating || rating) >= star ? "text-warning" : "text-secondary"}
              fill={(hoverRating || rating) >= star ? "#ffc107" : "none"}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
            />
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formCommentContent">
        <Form.Label>Nội dung bình luận</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Viết cảm nghĩ của bạn về hình nền này..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-secondary text-white border-secondary placeholder-light"
        />
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100">
        Gửi bình luận
      </Button>
    </Form>
  );
}

export default CommentForm;
