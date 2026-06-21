import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { AuthContext } from '../contexts/AuthContext';
import { LogIn, Key, User } from 'lucide-react';

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Tên đăng nhập không được để trống.';
    if (!password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống.';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải dài từ 6 ký tự trở lên.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');
    
    const result = await login(username.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center py-5 min-height-100vh text-white">
      <Card 
        className="bg-dark border-secondary p-4 shadow-lg" 
        style={{ width: '100%', maxWidth: '420px', borderRadius: '16px' }}
      >
        <Card.Body>
          <div className="text-center mb-4">
            <div 
              className="bg-primary bg-opacity-25 text-primary p-3 rounded-circle d-inline-flex mb-3"
              style={{ boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}
            >
              <LogIn size={32} />
            </div>
            <h3 className="fw-bold m-0">Đăng Nhập Hệ Thống</h3>
            <p className="text-white-50 mt-1" style={{ fontSize: '0.9rem' }}>
              Truy cập tài khoản Anime Wallpaper Hub
            </p>
          </div>

          {serverError && <Alert variant="danger">{serverError}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginUsername">
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

            <Form.Group className="mb-4" controlId="loginPassword">
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

            <Button 
              type="submit" 
              variant="primary" 
              className="w-100 py-2 fw-bold"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Account Info Hint */}
      <Card 
        className="bg-dark border-secondary p-3 mt-4 text-white-50 text-center shadow-sm" 
        style={{ width: '100%', maxWidth: '420px', borderRadius: '12px', fontSize: '0.85rem' }}
      >
        <p className="fw-bold mb-2 text-info text-uppercase" style={{ letterSpacing: '0.05em' }}>Tài khoản chạy thử nghiệm</p>
        <div className="d-flex justify-content-around border-top border-secondary pt-2">
          <div>
            <strong className="text-light">Tài khoản User:</strong><br />
            user / user123
          </div>
          <div className="border-start border-secondary ps-3">
            <strong className="text-light">Tài khoản Admin:</strong><br />
            admin / admin123
          </div>
        </div>
      </Card>
    </Container>
  );
}

export default LoginPage;
