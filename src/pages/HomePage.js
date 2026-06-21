import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Search } from 'lucide-react';
import CategoryFilter from '../components/wallpaper/CategoryFilter';
import WallpaperGrid from '../components/wallpaper/WallpaperGrid';

function HomePage({ favorites, onToggleFavorite }) {
  const [featuredWallpapers, setFeaturedWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBanner, setLoadingBanner] = useState(true);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setLoadingBanner(true);
    
    // Fetch categories for filter
    fetch('http://localhost:4000/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Lỗi khi tải danh mục:", err));

    // Fetch wallpapers just to get the featured ones for the banner
    fetch('http://localhost:4000/wallpapers')
      .then(res => res.json())
      .then(data => {
        setFeaturedWallpapers(data.filter(wp => wp.featured));
        setLoadingBanner(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải hình nền nổi bật:", err);
        setLoadingBanner(false);
      });
  }, []);

  return (
    <div className="bg-dark text-white min-height-100vh">
      {/* 1. Featured Banner Carousel */}
      {!loadingBanner && featuredWallpapers.length > 0 && (
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
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* 4. Automated Wallpaper Grid Component */}
        <WallpaperGrid
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
        />
      </Container>
    </div>
  );
}

export default HomePage;
