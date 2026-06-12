import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const RESOLUTION_OPTIONS = ['1920x1080', '3840x2160', '2560x1440', '1080x1920'];
const ORIENTATION_OPTIONS = ['Landscape', 'Portrait'];

function WallpaperForm({ onSubmit, initialData, categories, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    anime: '',
    categoryId: '',
    imageUrl: '',
    resolution: '1920x1080',
    orientation: 'Landscape',
    downloads: 0,
    likes: 0,
    rating: 5.0,
    author: '',
    description: '',
    featured: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Make sure fields are not undefined
        downloads: initialData.downloads ?? 0,
        likes: initialData.likes ?? 0,
        rating: initialData.rating ?? 5.0,
        featured: initialData.featured ?? false
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống.';
    if (!formData.anime.trim()) newErrors.anime = 'Tên bộ phim Anime không được để trống.';
    if (!formData.categoryId) newErrors.categoryId = 'Vui lòng chọn danh mục.';
    if (!formData.author.trim()) newErrors.author = 'Tên tác giả không được để trống.';
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Đường dẫn ảnh không được để trống.';
    } else if (!formData.imageUrl.startsWith('/') && !formData.imageUrl.startsWith('http')) {
      newErrors.imageUrl = 'Đường dẫn ảnh phải bắt đầu bằng "/" hoặc "http".';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      downloads: Number(formData.downloads),
      likes: Number(formData.likes),
      rating: Number(formData.rating)
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="text-white">
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="valTitle">
          <Form.Label>Tiêu đề hình nền</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            isInvalid={!!errors.title}
            className="bg-dark text-white border-secondary"
            placeholder="Ví dụ: Neon Tokyo Girl"
          />
          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="valAnime">
          <Form.Label>Tên bộ Anime</Form.Label>
          <Form.Control
            type="text"
            name="anime"
            value={formData.anime}
            onChange={handleChange}
            isInvalid={!!errors.anime}
            className="bg-dark text-white border-secondary"
            placeholder="Ví dụ: Naruto, Cyberpunk: Edgerunners, Original Art"
          />
          <Form.Control.Feedback type="invalid">{errors.anime}</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="valCategory">
          <Form.Label>Danh mục thể loại</Form.Label>
          <Form.Select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            isInvalid={!!errors.categoryId}
            className="bg-dark text-white border-secondary"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.categoryId}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="valAuthor">
          <Form.Label>Tác giả (Creator)</Form.Label>
          <Form.Control
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            isInvalid={!!errors.author}
            className="bg-dark text-white border-secondary"
            placeholder="Nhập tên tác giả..."
          />
          <Form.Control.Feedback type="invalid">{errors.author}</Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="valImageUrl">
        <Form.Label>Đường dẫn hình ảnh (Image URL)</Form.Label>
        <Form.Control
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          isInvalid={!!errors.imageUrl}
          className="bg-dark text-white border-secondary"
          placeholder="Ví dụ: /wallpapers/cyberpunk_girl.png hoặc link http"
        />
        <Form.Text className="text-muted">
          Bạn có thể dùng các ảnh mẫu có sẵn: <code>/wallpapers/cyberpunk_girl.png</code>, <code>/wallpapers/fantasy_landscape.png</code>, <code>/wallpapers/samurai_sunset.png</code>, v.v.
        </Form.Text>
        <Form.Control.Feedback type="invalid">{errors.imageUrl}</Form.Control.Feedback>
      </Form.Group>

      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="valResolution">
          <Form.Label>Độ phân giải</Form.Label>
          <Form.Select
            name="resolution"
            value={formData.resolution}
            onChange={handleChange}
            className="bg-dark text-white border-secondary"
          >
            {RESOLUTION_OPTIONS.map((res) => (
              <option key={res} value={res}>{res}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="valOrientation">
          <Form.Label>Chiều xoay</Form.Label>
          <Form.Select
            name="orientation"
            value={formData.orientation}
            onChange={handleChange}
            className="bg-dark text-white border-secondary"
          >
            {ORIENTATION_OPTIONS.map((ori) => (
              <option key={ori} value={ori}>{ori}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="valRating">
          <Form.Label>Điểm đánh giá (1.0 - 5.0)</Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            min="1"
            max="5"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="valDownloads">
          <Form.Label>Số lượt tải ban đầu</Form.Label>
          <Form.Control
            type="number"
            min="0"
            name="downloads"
            value={formData.downloads}
            onChange={handleChange}
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>

        <Form.Group as={Col} md="6" controlId="valLikes">
          <Form.Label>Số lượt thích ban đầu</Form.Label>
          <Form.Control
            type="number"
            min="0"
            name="likes"
            value={formData.likes}
            onChange={handleChange}
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="valDescription">
        <Form.Label>Mô tả chi tiết</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-dark text-white border-secondary"
          placeholder="Nhập mô tả về hình nền..."
        />
      </Form.Group>

      <Form.Group className="mb-4" controlId="valFeatured">
        <Form.Check
          type="checkbox"
          name="featured"
          label="Nổi bật (Hiển thị trên Banner trang chủ)"
          checked={formData.featured}
          onChange={handleChange}
          className="text-white-50"
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2 border-top border-secondary pt-3">
        <Button variant="secondary" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button variant="primary" type="submit">
          {initialData ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </Form>
  );
}

export default WallpaperForm;
