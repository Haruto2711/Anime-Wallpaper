import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { AuthContext } from '../contexts/AuthContext';
import { UserPlus, Key, Mail, User } from 'lucide-react';

function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống.';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Tên đăng nhập phải dài ít nhất 3 ký tự.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email không được để trống.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không đúng định dạng.';
    }

    if (!password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống.';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải dài từ 6 ký tự trở lên.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    setSuccessMessage('');
    
    const result = await register(username.trim(), email.trim(), password);
    setLoading(false);

    if (result.success) {
      setSuccessMessage('Đăng ký thành công! Đang chuyển hướng sang trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setServerError(result.message);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center py-5 min-height-100vh text-white">
      <Card 
        className="glass-panel border-secondary p-4 shadow-lg" 
        style={{ width: '100%', maxWidth: '420px', borderRadius: '16px' }}
      >
        <Card.Body>
          <div className="text-center mb-4">
            <div 
              className="bg-primary bg-opacity-25 text-primary p-3 rounded-circle d-inline-flex mb-3"
              style={{ boxShadow: '0 0 15px rgba(255, 133, 162, 0.3)' }}
            >
              <UserPlus size={32} />
            </div>
            <h3 className="fw-bold m-0">Đăng Ký Tài Khoản</h3>
            <p className="text-white-50 mt-1" style={{ fontSize: '0.9rem' }}>
              Tạo tài khoản Anime Wallpaper Hub mới
            </p>
          </div>

          {serverError && <Alert variant="danger">{serverError}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="registerUsername">
              <Form.Label>Tên đăng nhập</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Nhập username..."
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: null });
                  }}
                  isInvalid={!!errors.username}
                  className="bg-dark text-white border-secondary ps-5 py-2"
                />
                <User size={18} className="position-absolute top-50 translate-middle-y text-white-50 ms-3" />
                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerEmail">
              <Form.Label>Địa chỉ Email</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="email"
                  placeholder="Nhập email..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  isInvalid={!!errors.email}
                  className="bg-dark text-white border-secondary ps-5 py-2"
                />
                <Mail size={18} className="position-absolute top-50 translate-middle-y text-white-50 ms-3" />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="registerPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  isInvalid={!!errors.password}
                  className="bg-dark text-white border-secondary ps-5 py-2"
                />
                <Key size={18} className="position-absolute top-50 translate-middle-y text-white-50 ms-3" />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <Form.Group className="mb-4" controlId="registerConfirmPassword">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="password"
                  placeholder="Nhập lại mật khẩu..."
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                  }}
                  isInvalid={!!errors.confirmPassword}
                  className="bg-dark text-white border-secondary ps-5 py-2"
                />
                <Key size={18} className="position-absolute top-50 translate-middle-y text-white-50 ms-3" />
                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
              </div>
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-100 py-2 fw-bold"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng Ký"}
            </Button>
          </Form>

          <div className="text-center mt-3 text-white-50" style={{ fontSize: '0.9rem' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              Đăng nhập ngay
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterPage;
