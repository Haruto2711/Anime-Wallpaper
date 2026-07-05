import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { LogOut, LogIn, User, Plus, Bell, X, Pin, Grid, Scissors, CheckCircle, Settings } from 'lucide-react';

function Header() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { sakuraEnabled, setSakuraEnabled, accentColor, setAccentColor, sharpenEnabled, setSharpenEnabled } = useContext(SettingsContext);
  const navigate = useNavigate();
  
  // Custom menus states
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showCollageModal, setShowCollageModal] = useState(false);

  // Dynamic notifications list
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('user_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif-1',
        title: 'Cập nhật kho ảnh SAO',
        message: 'Admin đã thêm 29 hình nền Sword Art Online mới vào danh mục!',
        read: false,
        time: '10:00'
      },
      {
        id: 'notif-2',
        title: 'Tính năng bảo mật mới',
        message: 'Đã kích hoạt tính năng bảo vệ bản quyền ảnh chống tải chuột phải và kéo thả.',
        read: false,
        time: '09:00'
      }
    ];
  });

  useEffect(() => {
    const handleNewWp = (e) => {
      const newWp = e.detail;
      setNotifications(prev => {
        // Check for duplicate notifications just in case
        if (prev.some(n => n.wpId === newWp.id)) return prev;

        const updated = [
          {
            id: 'notif-' + newWp.id,
            title: 'Ảnh mới tải lên!',
            message: `Hình nền "${newWp.title}" vừa được thêm bởi ${newWp.author || 'Minh Thanh'}.`,
            read: false,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            wpId: newWp.id
          },
          ...prev
        ];
        localStorage.setItem('user_notifications', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('new-wallpaper-uploaded', handleNewWp);
    return () => window.removeEventListener('new-wallpaper-uploaded', handleNewWp);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpenNotifMenu = () => {
    setShowNotifMenu(!showNotifMenu);
    setShowCreateMenu(false);
    
    // Mark all as read when menu is toggled open
    if (!showNotifMenu) {
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, read: true }));
        localStorage.setItem('user_notifications', JSON.stringify(updated));
        return updated;
      });
    }
  };

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
                      onClick={handleOpenNotifMenu}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.55rem', padding: '0.15rem 0.3rem', transform: 'translate(20%, -30%)' }}>
                          {unreadCount}
                        </span>
                      )}
                    </span>

                    {showNotifMenu && (
                      <div 
                        className="position-absolute bg-dark border border-secondary rounded p-3 shadow-lg"
                        style={{ top: '100%', right: '0', zIndex: 1050, width: '320px', marginTop: '10px' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-bold text-white fs-6">Thông báo</span>
                          <button className="btn btn-sm btn-link text-white-50 p-0" onClick={() => setShowNotifMenu(false)}>
                            <X size={16} />
                          </button>
                        </div>
                        <div className="d-flex flex-column gap-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          {notifications.length === 0 ? (
                            <div className="text-center text-muted py-3" style={{ fontSize: '0.8rem' }}>
                              Không có thông báo nào.
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div 
                                key={notif.id} 
                                className="p-2 border-bottom border-secondary position-relative hover-highlight" 
                                style={{ 
                                  fontSize: '0.8rem', 
                                  cursor: notif.wpId ? 'pointer' : 'default',
                                  backgroundColor: notif.read ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                                  transition: 'background-color 0.2s ease-in-out'
                                }}
                                onClick={() => {
                                  if (notif.wpId) {
                                    navigate(`/wallpaper/${notif.wpId}`);
                                    setShowNotifMenu(false);
                                  }
                                }}
                              >
                                <div className="d-flex justify-content-between">
                                  <span className="text-white fw-semibold">{notif.title}</span>
                                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>{notif.time}</span>
                                </div>
                                <div className="text-white-50 mt-1" style={{ fontSize: '0.75rem' }}>{notif.message}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Settings Button */}
                  <div className="position-relative">
                    <span 
                      className="nav-link text-light-50 hover-text-white d-flex align-items-center ms-2"
                      onClick={() => {
                        setShowSettingsModal(true);
                        setShowCreateMenu(false);
                        setShowNotifMenu(false);
                      }}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      <Settings size={20} />
                    </span>
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

      {/* Settings & Support Offcanvas (Slide-out menu matching Pinterest) */}
      <Offcanvas 
        show={showSettingsModal} 
        onHide={() => setShowSettingsModal(false)} 
        placement="end"
        className="glass-panel text-white border-start border-secondary shadow-lg"
        style={{ width: '380px' }}
      >
        <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-secondary">
          <Offcanvas.Title className="fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--sakura-primary, #ff85a2)' }}>
            <Settings size={22} /> Cài đặt & Hỗ trợ
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="d-flex flex-column gap-4 py-4" style={{ overflowY: 'auto' }}>
          {/* Section 1: Cài đặt Giao diện */}
          <div>
            <h6 className="text-uppercase text-white-50 fw-bold mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
              Cài đặt giao diện
            </h6>
            <div className="d-flex flex-column gap-3">
              {/* Sakura Falling */}
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">Cánh hoa anh đào rơi</div>
                  <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Bật/Tắt cánh hoa rơi trên màn hình</small>
                </div>
                <Form.Check 
                  type="switch"
                  id="sakura-switch"
                  checked={sakuraEnabled}
                  onChange={(e) => setSakuraEnabled(e.target.checked)}
                  className="fs-5"
                />
              </div>

              {/* Sharpen Filter */}
              <div className="d-flex justify-content-between align-items-center border-top border-secondary-subtle pt-3">
                <div>
                  <div className="fw-semibold">Làm nét ảnh cực đại</div>
                  <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Bật/Tắt bộ lọc nét tối ưu hình nền</small>
                </div>
                <Form.Check 
                  type="switch"
                  id="sharpen-switch"
                  checked={sharpenEnabled}
                  onChange={(e) => setSharpenEnabled(e.target.checked)}
                  className="fs-5"
                />
              </div>

              {/* Theme Selector */}
              <div className="border-top border-secondary-subtle pt-3">
                <div className="fw-semibold mb-2">Tông màu chủ đạo</div>
                <div className="d-flex gap-2 flex-wrap">
                  <Button 
                    size="sm"
                    variant={accentColor === 'pink' ? 'primary' : 'outline-secondary'}
                    onClick={() => setAccentColor('pink')}
                    className="d-flex align-items-center gap-1 text-white border-secondary"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff85a2' }} />
                    Hồng Sakura
                  </Button>
                  <Button 
                    size="sm"
                    variant={accentColor === 'purple' ? 'primary' : 'outline-secondary'}
                    onClick={() => setAccentColor('purple')}
                    className="d-flex align-items-center gap-1 text-white border-secondary"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#b5179e' }} />
                    Tím Thạch Lan
                  </Button>
                  <Button 
                    size="sm"
                    variant={accentColor === 'blue' ? 'primary' : 'outline-secondary'}
                    onClick={() => setAccentColor('blue')}
                    className="d-flex align-items-center gap-1 text-white border-secondary"
                    style={{ fontSize: '0.75rem' }}
                  >
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00b4d8' }} />
                    Xanh Cyber
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tinh chỉnh & Liên kết */}
          <div className="border-top border-secondary pt-3">
            <h6 className="text-uppercase text-white-50 fw-bold mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
              Tinh chỉnh & Liên kết
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-3 mb-0" style={{ fontSize: '0.9rem' }}>
              <li>
                <span 
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert("Đang tinh chỉnh đề xuất theo sở thích của bạn...")}
                >
                  <span>Tinh chỉnh đề xuất của bạn</span>
                </span>
              </li>
              <li>
                <a 
                  href="https://pinterest.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between text-decoration-none"
                >
                  <span>Liên kết đến Pinterest</span>
                </a>
              </li>
              <li>
                <span 
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert("Mở cổng báo cáo vi phạm bản quyền / hình ảnh...")}
                >
                  <span>Cổng thông tin báo cáo vi phạm</span>
                </span>
              </li>
              <li>
                <span 
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert("Tải xuống và cài đặt ứng dụng Desktop Windows...")}
                >
                  <span>Cài đặt ứng dụng Windows</span>
                </span>
              </li>
              <li>
                <span 
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert("Đăng ký chương trình người thử nghiệm beta...")}
                >
                  <span className="d-flex align-items-center gap-2">Làm người thử nghiệm beta <X size={12} style={{ transform: 'rotate(45deg)' }} /></span>
                </span>
              </li>
            </ul>
          </div>

          {/* Section 3: Hỗ trợ */}
          <div className="border-top border-secondary pt-3">
            <h6 className="text-uppercase text-white-50 fw-bold mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
              Hỗ trợ
            </h6>
            <ul className="list-unstyled d-flex flex-column gap-3 mb-0" style={{ fontSize: '0.9rem' }}>
              <li>
                <span 
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert("Mở trung tâm trợ giúp người dùng...")}
                >
                  <span>Trung tâm trợ giúp</span>
                </span>
              </li>
              <li>
                <span 
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert("Tạo mã nhúng widget trang web...")}
                >
                  <span>Tạo widget</span>
                </span>
              </li>
              <li>
                <span 
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert("Mở danh sách các hình ảnh yêu cầu xóa...")}
                >
                  <span>Lượt xóa</span>
                </span>
              </li>
              <li>
                <span 
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert("Cài đặt quảng cáo cá nhân hóa của bạn...")}
                >
                  <span>Quảng cáo Cá nhân hóa</span>
                </span>
              </li>
              <li>
                <span 
                  className="text-light-50 hover-text-white d-flex align-items-center justify-content-between" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert("Cài đặt quyền riêng tư...")}
                >
                  <span>Quyền riêng tư của bạn</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Section 4: Tài nguyên */}
          <div className="border-top border-secondary pt-3 mt-auto">
            <div className="d-flex flex-wrap gap-2 text-white-50" style={{ fontSize: '0.75rem' }}>
              <a href="#about" className="text-decoration-none text-white-50 hover-text-white">Giới thiệu</a>
              <span>•</span>
              <a href="#press" className="text-decoration-none text-white-50 hover-text-white">Báo chí</a>
              <span>•</span>
              <a href="#biz" className="text-decoration-none text-white-50 hover-text-white">Doanh nghiệp</a>
              <span>•</span>
              <a href="#careers" className="text-decoration-none text-white-50 hover-text-white">Nghề nghiệp</a>
              <span>•</span>
              <a href="#devs" className="text-decoration-none text-white-50 hover-text-white">Nhà phát triển</a>
            </div>
            <div className="text-muted mt-2" style={{ fontSize: '0.7rem' }}>
              © 2026 AnimeWallpaper Inc.
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;
