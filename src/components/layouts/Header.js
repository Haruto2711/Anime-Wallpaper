import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LogOut, LogIn, User, Plus, Bell, X, Pin, Grid, Scissors, CheckCircle } from 'lucide-react';

function Header() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  
  // Custom menus states
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showCollageModal, setShowCollageModal] = useState(false);

  // Form states for Upload
  const [newTitle, setNewTitle] = useState('');
  const [newAnime, setNewAnime] = useState('Sword Art Online');
  const [newCategoryName, setNewCategoryName] = useState('Asuna Solo');
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'file'
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result); // Base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) {
      alert("Vui lòng nhập đầy đủ các trường thông tin!");
      return;
    }

    try {
      // 1. Resolve Category
      const cleanCategoryName = newCategoryName.trim();
      const categoriesRes = await fetch('http://localhost:4000/categories');
      const currentCats = await categoriesRes.json();

      let resolvedCategoryId = '';
      
      // Look for case-insensitive match
      const matchedCat = currentCats.find(
        cat => cat.name.toLowerCase() === cleanCategoryName.toLowerCase()
      );

      if (matchedCat) {
        resolvedCategoryId = matchedCat.id;
      } else {
        // Create new category dynamically
        const cleanId = 'cat-' + cleanCategoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const newCat = {
          id: cleanId,
          name: cleanCategoryName,
          description: `Các hình nền thuộc phân loại ${cleanCategoryName}`
        };

        const createCatRes = await fetch('http://localhost:4000/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCat)
        });

        if (!createCatRes.ok) throw new Error("Không thể tạo phân loại mới");
        resolvedCategoryId = cleanId;
      }

      // 2. Submit Wallpaper
      const newWallpaper = {
        id: "wp-" + Date.now(),
        title: newTitle,
        anime: newAnime,
        categoryId: resolvedCategoryId,
        imageUrl: newImageUrl,
        resolution: "1920x1080",
        orientation: "Landscape",
        downloads: 0,
        likes: 0,
        rating: 5.0,
        author: user?.username || "Guest",
        description: newDescription,
        featured: false,
        createdAt: new Date().toISOString()
      };

      const createWpRes = await fetch('http://localhost:4000/wallpapers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWallpaper)
      });

      if (!createWpRes.ok) throw new Error("Lỗi khi thêm hình nền");

      alert("Đăng hình nền thành công!");
      setShowUploadModal(false);
      // Reset form
      setNewTitle('');
      setNewImageUrl('');
      setNewDescription('');
      setNewCategoryName('Asuna Solo');
      setImageSource('url');
      window.location.reload(); // Reload to see the new wallpaper
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi: " + err.message);
    }
  };

  return (
    <>
      <Navbar expand="lg" variant="dark" className="glass-panel border-bottom border-secondary shadow-sm py-3 sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary display-font" style={{ letterSpacing: '-0.02em', fontSize: '1.4rem' }}>
            Anime Wallpaper Hub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto gap-3 align-items-center">
              <Nav.Link as={Link} to="/" className="text-light-50 hover-text-white">Trang chủ</Nav.Link>
              <Nav.Link as={Link} to="/favorites" className="text-light-50 hover-text-white">Yêu thích</Nav.Link>
              
              {/* Authenticated Actions: Create and Notifications */}
              {isAuthenticated && (
                <>
                  {/* Create Dropdown Toggle */}
                  <div className="position-relative">
                    <span 
                      className="nav-link text-light-50 hover-text-white d-flex align-items-center gap-1"
                      onClick={() => {
                        setShowCreateMenu(!showCreateMenu);
                        setShowNotifMenu(false);
                      }}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      Tạo <Plus size={16} />
                    </span>
                    
                    {showCreateMenu && (
                      <div 
                        className="position-absolute bg-dark border border-secondary rounded p-3 shadow-lg"
                        style={{ top: '100%', left: '0', zIndex: 1050, width: '320px', marginTop: '10px' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold text-white fs-5">Tạo</span>
                          <button className="btn btn-sm btn-link text-white-50 p-0" onClick={() => setShowCreateMenu(false)}>
                            <X size={18} />
                          </button>
                        </div>
                        
                        <div className="d-flex flex-column gap-3">
                          <div 
                            className="d-flex align-items-start gap-3 p-2 rounded" 
                            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => {
                              setShowCreateMenu(false);
                              setShowUploadModal(true);
                            }}
                          >
                            <div className="bg-secondary rounded p-2 text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                              <Pin size={20} />
                            </div>
                            <div>
                              <div className="fw-semibold text-white" style={{ fontSize: '0.95rem' }}>Ghim</div>
                              <div className="text-white-50" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>Đăng ảnh hoặc video và thêm liên kết, nhãn dán, hiệu ứng và nhiều điều khác</div>
                            </div>
                          </div>

                          <div 
                            className="d-flex align-items-start gap-3 p-2 rounded" 
                            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => {
                              setShowCreateMenu(false);
                              setShowBoardModal(true);
                            }}
                          >
                            <div className="bg-secondary rounded p-2 text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                              <Grid size={20} />
                            </div>
                            <div>
                              <div className="fw-semibold text-white" style={{ fontSize: '0.95rem' }}>Bảng</div>
                              <div className="text-white-50" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>Sắp xếp một bộ sưu tập Ghim bạn yêu thích bằng cách tạo bảng</div>
                            </div>
                          </div>

                          <div 
                            className="d-flex align-items-start gap-3 p-2 rounded" 
                            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={() => {
                              setShowCreateMenu(false);
                              setShowCollageModal(true);
                            }}
                          >
                            <div className="bg-secondary rounded p-2 text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                              <Scissors size={20} />
                            </div>
                            <div>
                              <div className="fw-semibold text-white" style={{ fontSize: '0.95rem' }}>Ảnh ghép</div>
                              <div className="text-white-50" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>Kết hợp và ghép nối các ý tưởng để xây dựng tầm nhìn của bạn và tạo điều gì đó mới</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notifications Button */}
                  <div className="position-relative">
                    <span 
                      className="nav-link text-light-50 hover-text-white d-flex align-items-center"
                      onClick={() => {
                        setShowNotifMenu(!showNotifMenu);
                        setShowCreateMenu(false);
                      }}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <Bell size={20} />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.55rem', padding: '0.15rem 0.3rem', transform: 'translate(20%, -30%)' }}>
                        2
                      </span>
                    </span>

                    {showNotifMenu && (
                      <div 
                        className="position-absolute bg-dark border border-secondary rounded p-3 shadow-lg"
                        style={{ top: '100%', right: '0', zIndex: 1050, width: '300px', marginTop: '10px' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold text-white fs-6">Thông báo</span>
                          <button className="btn btn-sm btn-link text-white-50 p-0" onClick={() => setShowNotifMenu(false)}>
                            <X size={16} />
                          </button>
                        </div>
                        <div className="d-flex flex-column gap-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          <div className="p-2 border-bottom border-secondary" style={{ fontSize: '0.8rem' }}>
                            <div className="text-white fw-semibold">Cập nhật kho ảnh SAO</div>
                            <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Admin đã thêm 29 hình nền Sword Art Online mới vào danh mục!</div>
                          </div>
                          <div className="p-2" style={{ fontSize: '0.8rem' }}>
                            <div className="text-white fw-semibold">Tính năng bảo mật mới</div>
                            <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Đã kích hoạt tính năng bảo vệ bản quyền ảnh chống tải chuột phải và kéo thả.</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {/* Show Admin option only if logged in user is admin */}
              {isAuthenticated && user.role === 'admin' && (
                <Nav.Link as={Link} to="/admin" className="text-light-50 hover-text-white">Quản trị</Nav.Link>
              )}

              {/* Auth Session State (Login/Logout) */}
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-3 border-start border-secondary ps-3 ms-2">
                  <span className="d-flex align-items-center gap-1 text-info" style={{ fontSize: '0.9rem' }}>
                    <User size={16} />
                    Hi, <strong>{user.username}</strong>
                    {user.role === 'admin' && <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>Admin</span>}
                  </span>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={logout}
                    className="d-flex align-items-center gap-1 px-2 py-1"
                  >
                    <LogOut size={14} /> Đăng xuất
                  </Button>
                </div>
              ) : (
                <div className="d-flex align-items-center border-start border-secondary ps-3 ms-2">
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="primary" 
                    size="sm"
                    className="d-flex align-items-center gap-1 px-3"
                  >
                    <LogIn size={14} /> Đăng nhập
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* --- Modals --- */}
      
      {/* Upload Wallpaper Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered contentClassName="glass-panel border-secondary text-white shadow-lg">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="d-flex align-items-center gap-2">
            <Pin size={22} className="text-primary" /> Đăng hình nền mới (Ghim)
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUploadSubmit}>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label>Tiêu đề hình nền</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ví dụ: Asuna - Sunset Glow" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
            
            <Form.Group>
              <Form.Label>Tên bộ Anime</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ví dụ: Sword Art Online" 
                value={newAnime}
                onChange={(e) => setNewAnime(e.target.value)}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Phân loại hình ảnh</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ví dụ: Asuna Solo, Kirito Solo, Yu-Gi-Oh!..." 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Nguồn hình ảnh</Form.Label>
              <div className="d-flex gap-4 mb-2">
                <Form.Check 
                  type="radio"
                  label="Dán URL ảnh"
                  name="imageSource"
                  checked={imageSource === 'url'}
                  onChange={() => {
                    setImageSource('url');
                    setNewImageUrl('');
                  }}
                  id="source-url"
                  className="text-light"
                />
                <Form.Check 
                  type="radio"
                  label="Tải ảnh lên"
                  name="imageSource"
                  checked={imageSource === 'file'}
                  onChange={() => {
                    setImageSource('file');
                    setNewImageUrl('');
                  }}
                  id="source-file"
                  className="text-light"
                />
              </div>

              {imageSource === 'url' ? (
                <Form.Control 
                  type="text" 
                  placeholder="Nhập liên kết (URL) của hình ảnh..." 
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  required
                  className="bg-dark text-white border-secondary"
                />
              ) : (
                <Form.Control 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!newImageUrl}
                  className="bg-dark text-white border-secondary"
                />
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Mô tả ngắn</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Viết vài dòng mô tả ngắn về hình ảnh này..." 
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Body className="pt-0">
            {newImageUrl && (
              <div className="text-center p-2 border border-secondary rounded bg-dark">
                <div className="text-white-50 mb-1" style={{ fontSize: '0.75rem' }}>Xem trước ảnh:</div>
                <img 
                  src={newImageUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: '4px' }} 
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-secondary">
            <Button variant="outline-light" onClick={() => setShowUploadModal(false)}>Hủy</Button>
            <Button variant="primary" type="submit">Đăng ảnh</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Board Modal (Placeholder) */}
      <Modal show={showBoardModal} onHide={() => setShowBoardModal(false)} centered contentClassName="glass-panel border-secondary text-white shadow-lg">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="d-flex align-items-center gap-2">
            <Grid size={22} className="text-primary" /> Tạo Bảng mới
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <CheckCircle size={48} className="text-success mb-3" />
          <h5>Tính năng Tạo Bảng</h5>
          <p className="text-white-50" style={{ fontSize: '0.85rem' }}>Chức năng lưu trữ, phân chia bộ sưu tập ghim theo bảng đang được phát triển và thử nghiệm. Vui lòng quay lại sau!</p>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="primary" onClick={() => setShowBoardModal(false)}>Đồng ý</Button>
        </Modal.Footer>
      </Modal>

      {/* Collage Modal (Placeholder) */}
      <Modal show={showCollageModal} onHide={() => setShowCollageModal(false)} centered contentClassName="glass-panel border-secondary text-white shadow-lg">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="d-flex align-items-center gap-2">
            <Scissors size={22} className="text-primary" /> Tạo Ảnh ghép
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <CheckCircle size={48} className="text-success mb-3" />
          <h5>Tính năng Ghép Ảnh</h5>
          <p className="text-white-50" style={{ fontSize: '0.85rem' }}>Chức năng cắt ghép nhiều hình nền nhỏ thành tranh ảnh ghép nghệ thuật đang được phát triển. Vui lòng quay lại sau!</p>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="primary" onClick={() => setShowCollageModal(false)}>Đồng ý</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Header;
