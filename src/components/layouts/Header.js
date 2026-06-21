import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LogOut, LogIn, User } from 'lucide-react';

function Header() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <Navbar expand="lg" variant="dark" bg="dark" className="border-bottom border-secondary shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary display-font" style={{ letterSpacing: '-0.02em', fontSize: '1.4rem' }}>
          Anime Wallpaper Hub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-3 align-items-center">
            <Nav.Link as={Link} to="/" className="text-light-50 hover-text-white">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/favorites" className="text-light-50 hover-text-white">Yêu thích</Nav.Link>
            
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
  );
}

export default Header;
