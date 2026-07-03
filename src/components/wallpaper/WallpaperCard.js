import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Heart, Download, Eye, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function WallpaperCard({ wallpaper, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const handleDownload = (e) => {
    e.stopPropagation(); // Avoid triggering card navigation
    if (!isAuthenticated) {
      alert("Bạn cần đăng ký hoặc đăng nhập tài khoản để tải ảnh!");
      navigate('/login');
      return;
    }
    // Open image in a new tab to simulate download
    window.open(process.env.PUBLIC_URL + wallpaper.imageUrl, '_blank');
  };

  return (
    <Card 
      className="glass-panel border-secondary h-100 shadow-sm overflow-hidden text-white" 
      style={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
      }}
      onClick={() => navigate(`/wallpaper/${wallpaper.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 133, 162, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="position-relative wallpaper-image-wrapper" style={{ overflow: 'hidden' }}>
        <Card.Img 
          variant="top" 
          src={process.env.PUBLIC_URL + wallpaper.imageUrl} 
          style={{ 
            width: '100%', 
            height: 'auto',
            display: 'block'
          }}
        />
        
        {/* Hover Overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center wallpaper-hover-overlay"
          style={{
            backgroundColor: 'rgba(255, 133, 162, 0.2)',
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
            zIndex: 1
          }}
        >
          <span className="btn btn-outline-light btn-sm d-flex align-items-center gap-1">
            <Eye size={16} /> Chi tiết
          </span>
        </div>

        <span 
          className="position-absolute top-0 start-0 m-2 badge bg-dark text-light border border-secondary"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', zIndex: 2 }}
        >
          {wallpaper.resolution}
        </span>
        <Button
          variant="link"
          className="position-absolute top-0 end-0 m-2 p-1 text-decoration-none"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(wallpaper.id);
          }}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}
        >
          <Heart 
            size={18} 
            fill={isFavorite ? '#f43f5e' : 'none'} 
            color={isFavorite ? '#f43f5e' : '#ffffff'} 
          />
        </Button>
      </div>

      <Card.Body className="d-flex flex-column justify-content-between p-3">
        <div>
          <Card.Title className="text-truncate mb-1" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            {wallpaper.title}
          </Card.Title>
          <Card.Text className="text-info text-truncate mb-3" style={{ fontSize: '0.85rem' }}>
            {wallpaper.anime}
          </Card.Text>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-3 text-white-50" style={{ fontSize: '0.8rem' }}>
            <span className="d-flex align-items-center gap-1">
              <Star size={14} className="text-warning" fill="#ffc107" />
              {wallpaper.rating}
            </span>
            <span className="d-flex align-items-center gap-1">
              <Download size={14} />
              {wallpaper.downloads} tải
            </span>
          </div>

          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              onClick={() => navigate(`/wallpaper/${wallpaper.id}`)}
            >
              <Eye size={14} /> Chi tiết
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleDownload}
              className="d-flex align-items-center justify-content-center px-3"
            >
              <Download size={14} />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default WallpaperCard;
