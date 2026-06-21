import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user does not have it, show Unauthorized page
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Container className="py-5 text-center text-white min-height-100vh d-flex flex-column align-items-center justify-content-center">
        <ShieldAlert size={64} className="text-danger mb-4" />
        <h1 className="fw-bold mb-3">Từ chối truy cập!</h1>
        <p className="text-white-50 mb-4" style={{ maxWidth: '500px' }}>
          Bạn không có quyền quản trị để truy cập trang này. Vui lòng đăng nhập với tài khoản có vai trò "{requiredRole}" để tiếp tục.
        </p>
        <div className="d-flex gap-3">
          <Button variant="outline-light" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <Button variant="primary" onClick={() => navigate('/')}>
            Về Trang chủ
          </Button>
        </div>
      </Container>
    );
  }

  // Otherwise, render the child component
  return children;
}

export default ProtectedRoute;
