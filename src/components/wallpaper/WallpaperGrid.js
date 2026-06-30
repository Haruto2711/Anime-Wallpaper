import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import WallpaperCard from './WallpaperCard';
import Loader from '../ui/Loader';

const WALLPAPERS_PER_PAGE = 48; // Number of items per page

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
      {/* Wallpapers Cards Grid */}
      <Row className="g-4 mb-4">
        {currentWallpapers.map((wp) => (
          <Col key={wp.id} xs={12} sm={6} md={4}>
            <WallpaperCard
              wallpaper={wp}
              isFavorite={favorites.includes(wp.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </Col>
        ))}
      </Row>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center my-4">
          <Pagination className="pagination-dark">
            <Pagination.Prev
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </>
  );
}

export default WallpaperGrid;
