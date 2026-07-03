import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Heart, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WallpaperCard from '../components/wallpaper/WallpaperCard';
import Loader from '../components/ui/Loader';

function FavoritesPage({ favorites, onToggleFavorite }) {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/wallpapers')
      .then(res => res.json())
      .then(data => {
        setWallpapers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải yêu thích:", err);
        setLoading(false);
      });
  }, []);

  // Filter wallpapers that are in favorites
  const favoriteWallpapers = wallpapers.filter(wp => favorites.includes(wp.id));

  return (
    <Container className="py-5 text-white min-height-100vh">
      <div className="d-flex align-items-center gap-3 mb-5 border-bottom border-secondary pb-3">
        <Heart size={32} fill="#f43f5e" color="#f43f5e" />
        <h2 className="m-0 fw-bold">Hình nền yêu thích ({favoriteWallpapers.length})</h2>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {favoriteWallpapers.length === 0 ? (
            <div className="text-center py-5 bg-dark border border-secondary rounded p-5">
              <Heart size={64} className="text-muted mb-3" />
              <h4>Danh sách yêu thích trống!</h4>
              <p className="text-white-50 mb-4">Bạn chưa thả tim cho hình nền nào. Hãy khám phá và lưu lại các hình nền bạn thích.</p>
              <Button variant="primary" onClick={() => navigate('/')} className="d-inline-flex align-items-center gap-2">
                <Home size={18} /> Khám phá ngay
              </Button>
            </div>
          ) : (
            <div className="masonry-grid mb-4">
              {/* Pinterest Masonry Grid */}
              {favoriteWallpapers.map((wp) => (
                <div key={wp.id} className="masonry-item">
                  <WallpaperCard
                    wallpaper={wp}
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default FavoritesPage;
