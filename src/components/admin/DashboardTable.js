import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { Pencil, Trash2, Plus } from 'lucide-react';

function DashboardTable({ wallpapers, categories, onEdit, onDelete, onAddNew }) {
  // Helper to get category name by id
  const getCategoryName = (catId) => {
    const category = categories.find(c => c.id === catId);
    return category ? category.name : 'Chưa phân loại';
  };

  return (
    <div className="bg-dark p-4 rounded border border-secondary text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0">Danh sách quản trị hình nền</h4>
        <Button variant="success" onClick={onAddNew} className="d-flex align-items-center gap-2">
          <Plus size={16} /> Thêm hình nền mới
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover variant="dark" className="align-middle border-secondary text-white-50">
          <thead>
            <tr className="text-white border-secondary">
              <th style={{ width: '80px' }}>Ảnh</th>
              <th>Tiêu đề</th>
              <th>Bộ phim Anime</th>
              <th>Danh mục</th>
              <th style={{ width: '120px' }}>Độ phân giải</th>
              <th style={{ width: '130px' }} className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {wallpapers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  Không có hình nền nào. Nhấp vào nút thêm để tạo mới!
                </td>
              </tr>
            ) : (
              wallpapers.map((wp) => (
                <tr key={wp.id} className="border-secondary">
                  <td>
                    <Image 
                      src={process.env.PUBLIC_URL + wp.imageUrl} 
                      alt={wp.title}
                      thumbnail
                      style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                      className="bg-secondary border-secondary"
                    />
                  </td>
                  <td className="text-white fw-bold">{wp.title}</td>
                  <td>{wp.anime}</td>
                  <td>{getCategoryName(wp.categoryId)}</td>
                  <td>{wp.resolution}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button 
                        variant="outline-warning" 
                        size="sm"
                        onClick={() => onEdit(wp)}
                        title="Chỉnh sửa"
                        className="p-1"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => onDelete(wp)}
                        title="Xóa"
                        className="p-1"
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
