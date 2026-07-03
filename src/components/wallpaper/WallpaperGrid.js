import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import WallpaperCard from './WallpaperCard';
import Loader from '../ui/Loader';

const WALLPAPERS_PER_PAGE = 10; // Number of items per page

function WallpaperGrid({ searchTerm = '', selectedCategory = null, favorites = [], onToggleFavorite }) {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch wallpapers from API
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/wallpapers')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách hình nền');
        return res.json();
      })
      .then((data) => {
        setWallpapers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter wallpapers based on search term and category
  const filteredWallpapers = wallpapers.filter((wp) => {
    const matchesSearch = 
      wp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wp.anime.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === null || wp.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredWallpapers.length / WALLPAPERS_PER_PAGE);
  const indexOfLastWp = currentPage * WALLPAPERS_PER_PAGE;
  const indexOfFirstWp = indexOfLastWp - WALLPAPERS_PER_PAGE;
  const currentWallpapers = filteredWallpapers.slice(indexOfFirstWp, indexOfLastWp);

  if (loading) {
    return <Loader message="Đang tải danh sách hình nền..." />;
  }

  if (filteredWallpapers.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <h4>Không tìm thấy hình nền nào!</h4>
        <p>Hãy thử tìm kiếm với từ khóa khác hoặc chuyển danh mục.</p>
      </div>
    );
  }

  return (
    <>
      {/* Pinterest Masonry Grid */}
      <div className="masonry-grid mb-4">
        {currentWallpapers.map((wp) => (
          <div key={wp.id} className="masonry-item">
            <WallpaperCard
              wallpaper={wp}
              isFavorite={favorites.includes(wp.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3 my-4">
          <Button 
            variant="outline-primary"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(p - 1, 1));
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            className="d-flex align-items-center gap-1 px-3"
          >
            &larr; Trang trước
          </Button>
          
          <span className="text-white-50" style={{ fontSize: '0.9rem' }}>
            Trang <strong>{currentPage}</strong> / {totalPages}
          </span>

          <Button 
            variant="outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(p + 1, totalPages));
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            className="d-flex align-items-center gap-1 px-3"
          >
            Trang sau &rarr;
          </Button>
        </div>
      )}
    </>
  );
}

export default WallpaperGrid;
