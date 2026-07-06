import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Search, Mic, MicOff } from 'lucide-react';
import CategoryFilter from '../components/wallpaper/CategoryFilter';
import WallpaperGrid from '../components/wallpaper/WallpaperGrid';

function HomePage({ favorites, onToggleFavorite }) {
  const [featuredWallpapers, setFeaturedWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBanner, setLoadingBanner] = useState(true);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check browser support for SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'vi-VN'; // Works for Vietnamese & common Anime names
      
      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const cleanText = transcript.replace(/\.$/g, '');
        setSearchTerm(cleanText);
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Trình duyệt của bạn không hỗ trợ Tìm kiếm bằng Giọng nói. Hãy thử Chrome hoặc Edge!");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  useEffect(() => {
    setLoadingBanner(true);
    
    const fetchCats = fetch('http://localhost:4000/categories').then(res => res.json());
    const fetchWps = fetch('http://localhost:4000/wallpapers').then(res => res.json());

    Promise.all([fetchCats, fetchWps])
      .then(([catsData, wpsData]) => {
        // Filter categories that have at least one wallpaper
        const activeCats = catsData.filter(cat => wpsData.some(wp => wp.categoryId === cat.id));
        setCategories(activeCats);
        setFeaturedWallpapers(wpsData.filter(wp => wp.featured));
        setLoadingBanner(false);
      })
      .catch(err => {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
        setLoadingBanner(false);
      });
  }, []);

  const getBannerPosition = (imageUrl) => {
    const path = imageUrl.toLowerCase();
    if (path.includes('yukino')) return 'center 75%'; // Focus lower to show her face rather than the top colorful wall
    if (path.includes('asuna') || path.includes('kirito')) return 'center 35%'; // Focus slightly higher to avoid cutting heads
    if (path.includes('chronicles') || path.includes('branded')) return 'center';
    return 'center';
  };

  return (
    <div className="bg-dark text-white min-height-100vh">
      {/* 1. Featured Banner Carousel */}
      {!loadingBanner && featuredWallpapers.length > 0 && (
        <Carousel className="mb-5 border-bottom border-secondary shadow">
          {featuredWallpapers.map((wp) => (
            <Carousel.Item key={wp.id}>
              <img
                className="d-block w-100"
                src={process.env.PUBLIC_URL + wp.imageUrl}
                alt={wp.title}
                style={{ 
                  height: 'auto',
                  maxHeight: '550px',
                  objectFit: 'cover', 
                  objectPosition: getBannerPosition(wp.imageUrl), 
                  filter: 'brightness(0.6)' 
                }}
              />
              <Carousel.Caption className="text-start pb-4 px-4 rounded glass-panel" style={{ maxWidth: '400px', left: '10%' }}>
                <span className="badge bg-primary mb-2">Featured Wallpaper</span>
                <h3 className="mb-1">{wp.title}</h3>
                <p className="text-info mb-0" style={{ fontSize: '0.9rem' }}>{wp.anime}</p>
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
              <Button 
                variant="outline-secondary" 
                className={`border-secondary d-flex align-items-center justify-content-center ${isListening ? 'pulse-animation' : 'bg-dark text-white-50'}`}
                onClick={toggleListening}
                title="Tìm kiếm bằng giọng nói"
                style={{ zIndex: 10 }}
              >
                {isListening ? <MicOff size={18} className="text-white" /> : <Mic size={18} />}
              </Button>
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
