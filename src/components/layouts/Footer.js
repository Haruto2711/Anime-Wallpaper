import React from 'react';
import Container from 'react-bootstrap/Container';

function Footer() {
  return (
    <footer className="bg-dark text-white-50 py-4 mt-5 border-top border-secondary">
      <Container className="text-center">
        <p className="mb-1">© 2026 Anime Wallpaper Hub. Thiết kế cho mục đích luyện tập và học tập ReactJS.</p>
        <p className="m-0" style={{ fontSize: '0.8rem' }}>Dữ liệu và hình ảnh được chuẩn bị sẵn bởi Antigravity.</p>
      </Container>
    </footer>
  );
}

export default Footer;
