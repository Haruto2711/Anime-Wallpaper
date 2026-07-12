import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Monitor, Smartphone, LayoutGrid } from 'lucide-react';
import WallpaperCard from './WallpaperCard';
import Loader from '../ui/Loader';

const WALLPAPERS_PER_PAGE = 10; // Number of items per page

function WallpaperGrid({ searchTerm = '', selectedCategory = null, favorites = [], onToggleFavorite }) {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [orientationFilter, setOrientationFilter] = useState('all'); // 'all' | 'landscape' | 'portrait'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'downloads' | 'likes' | 'rating'

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

  const [excludedCats, setExcludedCats] = useState(() => {
    const saved = localStorage.getItem('excluded_categories');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('excluded_categories');
      setExcludedCats(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener('category-filter-updated', handleUpdate);
    return () => window.removeEventListener('category-filter-updated', handleUpdate);
  }, []);

  // Filter wallpapers based on search term, category, excluded categories and orientation
  const filteredWallpapers = wallpapers.filter((wp) => {
    // Hide wallpapers in excluded categories from "Tinh chỉnh đề xuất"
    if (excludedCats.includes(wp.categoryId)) return false;

    const matchesSearch = 
      wp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wp.anime.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === null || wp.categoryId === selectedCategory;

    const matchesOrientation = 
      orientationFilter === 'all' || 
      (orientationFilter === 'landscape' && wp.orientation.toLowerCase() === 'landscape') ||
      (orientationFilter === 'portrait' && wp.orientation.toLowerCase() === 'portrait');

    return matchesSearch && matchesCategory && matchesOrientation;
  });

  // Sort wallpapers based on selection
  const sortedWallpapers = [...filteredWallpapers].sort((a, b) => {
    if (sortBy === 'newest') {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      if (dateB - dateA !== 0) return dateB - dateA;
      return b.id.localeCompare(a.id);
    }
    if (sortBy === 'downloads') {
      return (b.downloads || 0) - (a.downloads || 0);
    }
    if (sortBy === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    }
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, excludedCats, orientationFilter, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedWallpapers.length / WALLPAPERS_PER_PAGE);
  const indexOfLastWp = currentPage * WALLPAPERS_PER_PAGE;
  const indexOfFirstWp = indexOfLastWp - WALLPAPERS_PER_PAGE;
  const currentWallpapers = sortedWallpapers.slice(indexOfFirstWp, indexOfLastWp);

  if (loading) {
    return <Loader message="Đang tải danh sách hình nền..." />;
  }

  return (
    <>
      {/* Filters & Sorting Toolbar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 p-3 rounded glass-panel border border-secondary shadow-sm">
        {/* Left Side: Orientation Filter */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-white-50 small fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Thiết bị:</span>
          <div className="btn-group btn-group-sm">
            <Button 
              variant={orientationFilter === 'all' ? 'primary' : 'outline-secondary'}
              onClick={() => setOrientationFilter('all')}
              className="d-flex align-items-center gap-1 text-white border-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              <LayoutGrid size={14} /> Tất cả
            </Button>
            <Button 
              variant={orientationFilter === 'landscape' ? 'primary' : 'outline-secondary'}
              onClick={() => setOrientationFilter('landscape')}
              className="d-flex align-items-center gap-1 text-white border-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              <Monitor size={14} /> Máy tính
            </Button>
            <Button 
              variant={orientationFilter === 'portrait' ? 'primary' : 'outline-secondary'}
              onClick={() => setOrientationFilter('portrait')}
              className="d-flex align-items-center gap-1 text-white border-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              <Smartphone size={14} /> Điện thoại
            </Button>
          </div>
        </div>

        {/* Right Side: Sorting Dropdown */}
        <div className="d-flex align-items-center gap-2">
          <span className="text-white-50 small fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Sắp xếp:</span>
          <Form.Select 
            size="sm" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark text-white border-secondary"
            style={{ width: '160px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <option value="newest">🗓️ Mới nhất</option>
            <option value="downloads">📥 Tải nhiều nhất</option>
            <option value="likes">❤️ Thích nhiều nhất</option>
            <option value="rating">⭐ Đánh giá cao</option>
          </Form.Select>
        </div>
      </div>

      {sortedWallpapers.length === 0 ? (
        <div className="text-center py-5 text-muted glass-panel border border-secondary rounded">
          <h4>Không tìm thấy hình nền nào!</h4>
          <p>Hãy thử thay đổi bộ lọc thiết bị, chọn sắp xếp khác hoặc chuyển danh mục.</p>
        </div>
      ) : (
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
      )}
    </>
  );
}

export default WallpaperGrid;
