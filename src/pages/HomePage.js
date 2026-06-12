import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Pagination from 'react-bootstrap/Pagination';
import { Search } from 'lucide-react';
import CategoryFilter from '../components/wallpaper/CategoryFilter';
import WallpaperCard from '../components/wallpaper/WallpaperCard';
import Loader from '../components/ui/Loader';


const WALLPAPERS_PER_PAGE = 3; // Keep it small so user can easily test pagination!

function HomePage({ favorites, onToggleFavorite }) {
  const [wallpapers, setWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const fetchWallpapers = fetch('http://localhost:4000/wallpapers').then(res => res.json());
    const fetchCategories = fetch('http://localhost:4000/categories').then(res => res.json());

    Promise.all([fetchWallpapers, fetchCategories])
      .then(([wpData, catData]) => {
        setWallpapers(wpData);
        setCategories(catData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu từ API:", err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredWallpapers = wallpapers.filter((wp) => {
    const matchesSearch = 
      wp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wp.anime.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === null || wp.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Featured wallpapers (for carousel banner)
  const featuredWallpapers = wallpapers.filter(wp => wp.featured);

  // Pagination calculations
  const totalPages = Math.ceil(filteredWallpapers.length / WALLPAPERS_PER_PAGE);
  const indexOfLastWp = currentPage * WALLPAPERS_PER_PAGE;
  const indexOfFirstWp = indexOfLastWp - WALLPAPERS_PER_PAGE;
  const currentWallpapers = filteredWallpapers.slice(indexOfFirstWp, indexOfLastWp);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-dark text-white min-height-100vh">
      {/* 1. Featured Banner Carousel */}
      {!loading && featuredWallpapers.length > 0 && (
        <Carousel className="mb-5 border-bottom border-secondary shadow">
          {featuredWallpapers.map((wp) => (
            <Carousel.Item key={wp.id} style={{ height: '400px' }}>
              <img
                className="d-block w-100 h-100"
                src={process.env.PUBLIC_URL + wp.imageUrl}
                alt={wp.title}
                style={{ objectFit: 'cover', filter: 'brightness(0.6)' }}
              />
              <Carousel.Caption className="text-start pb-5 px-4 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', maxWidth: '500px', left: '10%' }}>
                <span className="badge bg-primary mb-2">Featured Wallpaper</span>
                <h3>{wp.title}</h3>
                <p className="text-info">{wp.anime}</p>
                <p className="d-none d-md-block text-white-50" style={{ fontSize: '0.9rem' }}>
                  {wp.description}
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      <Container>
        {/* 2. Search Bar */}
        <Row className="justify-content-center mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text className="bg-dark border-secondary text-white-50">
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Tìm kiếm hình nền hoặc bộ Anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark text-white border-secondary"
              />
            </InputGroup>
          </Col>
        </Row>

        {/* 3. Category Filter */}
        {!loading && (
          <CategoryFilter
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* 4. Grid list & Loading States */}
        {loading ? (
          <Loader />
        ) : (
          <>
            {filteredWallpapers.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <h4>Không tìm thấy hình nền phù hợp.</h4>
                <p>Hãy thử tìm kiếm với từ khóa khác.</p>
              </div>
            ) : (
              <>
                <Row className="g-4 mb-5">
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

                {/* 5. Pagination Buttons */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination className="pagination-dark">
                      <Pagination.Prev
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default HomePage;
