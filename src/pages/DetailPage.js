import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { ArrowLeft, Heart, Download, Star, Monitor, Calendar } from 'lucide-react';
import CommentSection from '../components/comments/CommentSection';
import Loader from '../components/ui/Loader';
import WallpaperCard from '../components/wallpaper/WallpaperCard';

function DetailPage({ favorites, onToggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [wallpaper, setWallpaper] = useState(null);
  const [comments, setComments] = useState([]);
  const [allWallpapers, setAllWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const wpFetch = fetch(`http://localhost:4000/wallpapers/${id}`).then(res => {
      if (!res.ok) throw new Error('Không tìm thấy hình nền');
      return res.json();
    });
    const commentsFetch = fetch(`http://localhost:4000/comments?wallpaperId=${id}`).then(res => res.json());
    const allWpsFetch = fetch('http://localhost:4000/wallpapers').then(res => res.json());

    Promise.all([wpFetch, commentsFetch, allWpsFetch])
      .then(([wp, comms, allWps]) => {
        setWallpaper(wp);
        setComments(comms);
        setAllWallpapers(allWps);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu chi tiết:", err);
        setLoading(false);
      });
  }, [id]);

  const handleToggleFavorite = () => {
    onToggleFavorite(id);
  };

  const handleDownload = () => {
    const updatedDownloads = (wallpaper?.downloads || 0) + 1;
    
    // Update local state immediately
    setWallpaper(prev => prev ? { ...prev, downloads: updatedDownloads } : null);
    
    // Patch to server
    fetch(`http://localhost:4000/wallpapers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ downloads: updatedDownloads })
    }).catch(err => console.error("Không thể cập nhật lượt tải lên server:", err));
    
    // Open image download
    window.open(process.env.PUBLIC_URL + (wallpaper?.imageUrl || ''), '_blank');
  };

  const handleSubmitComment = (newComment) => {
    const commentWithId = {
      ...newComment,
      id: `comment-${Date.now()}`,
      wallpaperId: id
    };

    fetch('http://localhost:4000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentWithId)
    })
      .then(res => res.json())
      .then(savedComment => {
        setComments(prev => [savedComment, ...prev]);
        updateWallpaperRating(commentWithId.rating);
      })
      .catch(err => {
        console.error("Không thể lưu bình luận lên server:", err);
      });
  };

  const updateWallpaperRating = (newRating) => {
    // Calculate new average rating
    const allComms = [ { rating: newRating }, ...comments ];
    const sum = allComms.reduce((acc, c) => acc + c.rating, 0);
    const avg = parseFloat((sum / allComms.length).toFixed(1));
    
    // Patch to server
    fetch(`http://localhost:4000/wallpapers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: avg })
    })
      .then(res => res.json())
      .then(updatedWp => {
        setWallpaper(updatedWp);
      })
      .catch(err => console.error("Không thể cập nhật điểm đánh giá:", err));
  };

  // Related wallpapers (same category, max 3 cards)
  const relatedWallpapers = allWallpapers
    .filter(wp => wp.categoryId === wallpaper?.categoryId && wp.id !== id)
    .slice(0, 3);

  if (loading) return <Container className="py-5"><Loader /></Container>;
  if (!wallpaper) {
    return (
      <Container className="py-5 text-center text-white">
        <h2>Không tìm thấy hình nền!</h2>
        <Button variant="primary" onClick={() => navigate('/')} className="mt-3">
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Button>
      </Container>
    );
  }

  const isFavorite = favorites.includes(wallpaper.id);

  return (
    <Container className="py-5 text-white">
      {/* Back Button */}
      <Button variant="outline-light" onClick={() => navigate(-1)} className="mb-4 d-flex align-items-center gap-2">
        <ArrowLeft size={16} /> Quay lại
      </Button>

      <Row className="g-5">
        {/* Left Side: Large image preview */}
        <Col lg={7}>
          <div className="border border-secondary rounded overflow-hidden bg-black shadow-lg">
            <Image 
              src={process.env.PUBLIC_URL + wallpaper.imageUrl} 
              alt={wallpaper.title} 
              fluid 
              className="w-100"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>
        </Col>

        {/* Right Side: Details and action buttons */}
        <Col lg={5}>
          <div className="bg-dark p-4 rounded border border-secondary h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h2 className="m-0 fw-bold">{wallpaper.title}</h2>
                <Button 
                  variant="link" 
                  onClick={handleToggleFavorite}
                  className="p-1 text-decoration-none"
                >
                  <Heart size={28} fill={isFavorite ? '#f43f5e' : 'none'} color={isFavorite ? '#f43f5e' : '#ffffff'} />
                </Button>
              </div>

              <h4 className="text-info mb-4">{wallpaper.anime}</h4>
              <p className="text-white-50 mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                {wallpaper.description || "Không có mô tả chi tiết cho hình nền này."}
              </p>

              <hr className="border-secondary mb-4" />

              {/* Wallpaper details grid */}
              <Row className="gy-3 mb-4 text-white-50" style={{ fontSize: '0.9rem' }}>
                <Col xs={6}>
                  <div className="d-flex align-items-center gap-2">
                    <Monitor size={16} className="text-primary" />
                    <span>Độ phân giải: <strong>{wallpaper.resolution}</strong></span>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="d-flex align-items-center gap-2">
                    <Star size={16} className="text-warning" fill="#ffc107" />
                    <span>Đánh giá: <strong>{wallpaper.rating} / 5</strong></span>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="d-flex align-items-center gap-2">
                    <Download size={16} className="text-success" />
                    <span>Lượt tải về: <strong>{wallpaper.downloads}</strong></span>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-info" />
                    <span>Ngày đăng: <strong>{new Date(wallpaper.createdAt).toLocaleDateString('vi-VN')}</strong></span>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mt-4">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleDownload}
                className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3"
              >
                <Download size={20} /> Tải hình nền gốc
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Related Wallpapers */}
      {relatedWallpapers.length > 0 && (
        <div className="mt-5 pt-4">
          <h3 className="mb-4 border-bottom border-secondary pb-2">Hình nền liên quan</h3>
          <Row className="g-4">
            {relatedWallpapers.map(wp => (
              <Col key={wp.id} xs={12} sm={6} md={4}>
                <WallpaperCard 
                  wallpaper={wp}
                  isFavorite={favorites.includes(wp.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Comments section */}
      <div className="mt-5">
        <CommentSection 
          comments={comments} 
          onSubmitComment={handleSubmitComment} 
        />
      </div>
    </Container>
  );
}

export default DetailPage;
