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

  const [categoryName, setCategoryName] = useState('');
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'file'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        downloads: initialData.downloads ?? 0,
        likes: initialData.likes ?? 0,
        rating: initialData.rating ?? 5.0,
        featured: initialData.featured ?? false
      });
      // Find matching category name from initial categoryId
      const found = categories.find(c => c.id === initialData.categoryId);
      setCategoryName(found ? found.name : '');
      // Determine initial image source
      setImageSource(initialData.imageUrl?.startsWith('data:') ? 'file' : 'url');
    } else {
      setCategoryName('');
      setImageSource('url');
    }
  }, [initialData, categories]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
        if (errors.imageUrl) {
          setErrors(prev => ({ ...prev, imageUrl: null }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
    if (!categoryName.trim()) newErrors.categoryName = 'Danh mục thể loại không được để trống.';
    if (!formData.author.trim()) newErrors.author = 'Tên tác giả không được để trống.';
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Đường dẫn hoặc tệp ảnh không được để trống.';
    } else if (imageSource === 'url' && !formData.imageUrl.startsWith('/') && !formData.imageUrl.startsWith('http')) {
      newErrors.imageUrl = 'Đường dẫn ảnh phải bắt đầu bằng "/" hoặc "http".';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      let resolvedCategoryId = '';
      const cleanCategoryName = categoryName.trim();
      
      // Fetch fresh list of categories
      const res = await fetch('http://localhost:4000/categories');
      const currentCats = await res.json();
      
      const matchedCat = currentCats.find(
        cat => cat.name.toLowerCase() === cleanCategoryName.toLowerCase()
      );
      
      if (matchedCat) {
        resolvedCategoryId = matchedCat.id;
      } else {
        const cleanId = 'cat-' + cleanCategoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const newCat = {
          id: cleanId,
          name: cleanCategoryName,
          description: `Các hình nền thuộc phân loại ${cleanCategoryName}`
        };
        
        const createRes = await fetch('http://localhost:4000/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCat)
        });
        
        if (!createRes.ok) throw new Error();
        resolvedCategoryId = cleanId;
      }

      onSubmit({
        ...formData,
        categoryId: resolvedCategoryId,
        downloads: Number(formData.downloads),
        likes: Number(formData.likes),
        rating: Number(formData.rating)
      });
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đồng bộ danh mục thể loại mới!");
    } finally {
      setIsSubmitting(false);
    }
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
          <Form.Control
            type="text"
            name="categoryName"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (errors.categoryName) {
                setErrors({ ...errors, categoryName: null });
              }
            }}
            isInvalid={!!errors.categoryName}
            className="bg-dark text-white border-secondary"
            placeholder="Nhập danh mục (ví dụ: Yu-Gi-Oh!, Oregairu...)"
          />
          <Form.Control.Feedback type="invalid">{errors.categoryName}</Form.Control.Feedback>
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

      <Form.Group className="mb-3">
        <Form.Label>Nguồn hình ảnh (Image Source)</Form.Label>
        <div className="d-flex gap-3 mb-2 text-white-50">
          <Form.Check
            type="radio"
            id="adminSrcUrl"
            label="Nhập URL ảnh / Dùng ảnh mẫu"
            name="imageSource"
            checked={imageSource === 'url'}
            onChange={() => setImageSource('url')}
            className="text-white-50"
          />
          <Form.Check
            type="radio"
            id="adminSrcFile"
            label="Tải lên tệp ảnh từ máy tính"
            name="imageSource"
            checked={imageSource === 'file'}
            onChange={() => setImageSource('file')}
            className="text-white-50"
          />
        </div>

        {imageSource === 'url' ? (
          <>
            <Form.Control
              type="text"
              name="imageUrl"
              value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
              onChange={handleChange}
              isInvalid={!!errors.imageUrl}
              className="bg-dark text-white border-secondary"
              placeholder="Ví dụ: /wallpapers/cyberpunk_girl.png hoặc link http"
            />
            <Form.Text className="text-muted">
              Bạn có thể dùng các ảnh mẫu có sẵn: <code>/wallpapers/cyberpunk_girl.png</code>, <code>/wallpapers/fantasy_landscape.png</code>, <code>/wallpapers/samurai_sunset.png</code>, v.v.
            </Form.Text>
            <Form.Control.Feedback type="invalid">{errors.imageUrl}</Form.Control.Feedback>
          </>
        ) : (
          <>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              isInvalid={!!errors.imageUrl}
              className="bg-dark text-white border-secondary"
            />
            {formData.imageUrl.startsWith('data:') && (
              <div className="mt-2 text-success" style={{ fontSize: '0.85rem' }}>
                ✓ Đã nhận dữ liệu tệp ảnh thành công.
              </div>
            )}
            <Form.Control.Feedback type="invalid">{errors.imageUrl}</Form.Control.Feedback>
          </>
        )}
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
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : (initialData ? "Cập nhật" : "Thêm mới")}
        </Button>
      </div>
    </Form>
  );
}

export default WallpaperForm;
