import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Pencil, Trash2, Plus, Search, Folder, Tv, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function DashboardTable({ wallpapers, categories, onEdit, onDelete, onAddNew }) {
  const [adminSearch, setAdminSearch] = useState('');
  const navigate = useNavigate();

  // Helper to get category name by id
  const getCategoryName = (catId) => {
    const category = categories.find(c => c.id === catId);
    return category ? category.name : 'Chưa phân loại';
  };

  const filteredWallpapers = wallpapers.filter((wp) => {
    const searchLower = adminSearch.toLowerCase();
    return (
      wp.title.toLowerCase().includes(searchLower) ||
      wp.anime.toLowerCase().includes(searchLower) ||
      getCategoryName(wp.categoryId).toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="glass-panel p-4 rounded text-white shadow-lg" style={{ border: '1px solid var(--sakura-glass-border, rgba(255, 255, 255, 0.12))' }}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="m-0 fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--sakura-primary, #ff85a2)' }}>
            ⚙️ Quản Trị Hệ Thống Hình Nền
          </h4>
          <small className="text-white-50">
            Tổng cộng: <strong>{wallpapers.length}</strong> hình nền | Lọc được: <strong>{filteredWallpapers.length}</strong> hình nền
          </small>
        </div>
        <Button 
          onClick={onAddNew} 
          className="d-flex align-items-center gap-2 px-3 fw-bold"
          style={{ 
            backgroundColor: 'var(--sakura-primary, #ff85a2)', 
            borderColor: 'var(--sakura-primary, #ff85a2)',
            color: 'white',
            transition: 'opacity 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
        >
          <Plus size={16} /> Thêm hình nền mới
        </Button>
      </div>

      {/* Admin Search Bar */}
      <InputGroup className="mb-4">
        <InputGroup.Text className="bg-dark border-secondary text-white-50">
          <Search size={18} />
        </InputGroup.Text>
        <Form.Control
          placeholder="Tìm kiếm nhanh tiêu đề, bộ anime hoặc danh mục..."
          value={adminSearch}
          onChange={(e) => setAdminSearch(e.target.value)}
          className="bg-dark text-white border-secondary"
        />
      </InputGroup>

      <div className="table-responsive">
        <Table hover variant="dark" className="align-middle text-white-50" style={{ backgroundColor: 'transparent' }}>
          <thead>
            <tr className="text-white border-secondary" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
              <th style={{ width: '80px' }}>Ảnh</th>
              <th>Tiêu đề</th>
              <th>Bộ phim Anime</th>
              <th>Danh mục</th>
              <th style={{ width: '120px' }}>Độ phân giải</th>
              <th style={{ width: '150px' }} className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredWallpapers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  Không tìm thấy hình nền nào phù hợp với từ khóa!
                </td>
              </tr>
            ) : (
              filteredWallpapers.map((wp) => (
                <tr key={wp.id} className="border-secondary hover-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <td>
                    <Image 
                      src={process.env.PUBLIC_URL + wp.imageUrl} 
                      alt={wp.title}
                      style={{ width: '70px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                      className="bg-secondary"
                    />
                  </td>
                  <td>
                    <span className="text-white fw-bold d-block">{wp.title}</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>ID: {wp.id} {wp.featured && <span className="badge bg-danger ms-1">Featured</span>}</small>
                  </td>
                  <td>
                    <span className="badge bg-dark text-info border border-info d-inline-flex align-items-center gap-1">
                      <Tv size={12} /> {wp.anime}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-dark text-warning border border-warning d-inline-flex align-items-center gap-1">
                      <Folder size={12} /> {getCategoryName(wp.categoryId)}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-secondary text-light">{wp.resolution}</span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button 
                        variant="outline-info"
                        size="sm"
                        onClick={() => navigate(`/wallpaper/${wp.id}`)}
                        title="Xem chi tiết"
                        className="p-1 d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="outline-warning" 
                        size="sm"
                        onClick={() => onEdit(wp)}
                        title="Chỉnh sửa"
                        className="p-1 d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => onDelete(wp)}
                        title="Xóa"
                        className="p-1 d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default DashboardTable;
