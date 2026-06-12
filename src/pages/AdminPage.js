import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import DashboardTable from '../components/admin/DashboardTable';
import WallpaperForm from '../components/admin/WallpaperForm';
import ConfirmModal from '../components/ui/ConfirmModal';
import Loader from '../components/ui/Loader';

function AdminPage() {
  const [wallpapers, setWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // View state: 'table' | 'add' | 'edit'
  const [view, setView] = useState('table');
  const [editingWp, setEditingWp] = useState(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingWp, setDeletingWp] = useState(null);

  // Notification state
  const [notice, setNotice] = useState(null); // { type: 'success' | 'danger', message: '' }

  const loadData = () => {
    setLoading(true);
    const fetchWps = fetch('http://localhost:4000/wallpapers').then(res => {
      if (!res.ok) throw new Error('Không thể lấy danh sách hình nền');
      return res.json();
    });
    const fetchCats = fetch('http://localhost:4000/categories').then(res => {
      if (!res.ok) throw new Error('Không thể lấy danh sách danh mục');
      return res.json();
    });

    Promise.all([fetchWps, fetchCats])
      .then(([wps, cats]) => {
        setWallpapers(wps);
        setCategories(cats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi kết nối json-server:", err);
        setLoading(false);
        showNotice('danger', 'Lỗi kết nối đến json-server! Vui lòng kiểm tra lại cổng 4000.');
      });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotice = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => {
      setNotice(null);
    }, 4000);
  };

  // Create (Add new) handler
  const handleAddWallpaper = (newWp) => {
    const wpWithId = {
      ...newWp,
      id: `wp-${String(Date.now()).slice(-4)}`, // Generate a short ID
      createdAt: new Date().toISOString()
    };

    fetch('http://localhost:4000/wallpapers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wpWithId)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setWallpapers(prev => [data, ...prev]);
        setView('table');
        showNotice('success', 'Thêm hình nền thành công vào database!');
      })
      .catch((err) => {
        console.error("Lỗi khi thêm hình nền:", err);
        showNotice('danger', 'Không thể lưu hình nền lên server. Vui lòng thử lại.');
      });
  };

  // Update (Edit) handler
  const handleEditWallpaper = (updatedWp) => {
    fetch(`http://localhost:4000/wallpapers/${updatedWp.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWp)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setWallpapers(prev => prev.map(w => w.id === data.id ? data : w));
        setView('table');
        setEditingWp(null);
        showNotice('success', 'Cập nhật hình nền thành công!');
      })
      .catch((err) => {
        console.error("Lỗi khi sửa hình nền:", err);
        showNotice('danger', 'Không thể cập nhật hình nền lên server.');
      });
  };

  // Delete handler triggered from Confirm Modal
  const handleDeleteConfirm = () => {
    if (!deletingWp) return;

    fetch(`http://localhost:4000/wallpapers/${deletingWp.id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setWallpapers(prev => prev.filter(w => w.id !== deletingWp.id));
        setShowDeleteModal(false);
        setDeletingWp(null);
        showNotice('success', 'Đã xóa hình nền khỏi database thành công!');
      })
      .catch((err) => {
        console.error("Lỗi khi xóa hình nền:", err);
        showNotice('danger', 'Không thể xóa hình nền khỏi server.');
      });
  };

  const startEdit = (wp) => {
    setEditingWp(wp);
    setView('edit');
  };

  const startDelete = (wp) => {
    setDeletingWp(wp);
    setShowDeleteModal(true);
  };

  return (
    <Container className="py-5 text-white min-height-100vh">
      {notice && (
        <Alert variant={notice.type} className="mb-4 text-center">
          {notice.message}
        </Alert>
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          {view === 'table' && (
            <DashboardTable
              wallpapers={wallpapers}
              categories={categories}
              onEdit={startEdit}
              onDelete={startDelete}
              onAddNew={() => setView('add')}
            />
          )}

          {view === 'add' && (
            <div className="bg-dark p-4 rounded border border-secondary">
              <h3 className="mb-4 border-bottom border-secondary pb-2">Thêm hình nền anime mới</h3>
              <WallpaperForm
                categories={categories}
                onSubmit={handleAddWallpaper}
                onCancel={() => setView('table')}
              />
            </div>
          )}

          {view === 'edit' && (
            <div className="bg-dark p-4 rounded border border-secondary">
              <h3 className="mb-4 border-bottom border-secondary pb-2">Chỉnh sửa thông tin hình nền</h3>
              <WallpaperForm
                categories={categories}
                initialData={editingWp}
                onSubmit={handleEditWallpaper}
                onCancel={() => {
                  setView('table');
                  setEditingWp(null);
                }}
              />
            </div>
          )}

          {/* Confirm Delete Modal */}
          <ConfirmModal
            show={showDeleteModal}
            onHide={() => {
              setShowDeleteModal(false);
              setDeletingWp(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Xác nhận xóa hình nền"
            message={deletingWp ? `Bạn có chắc chắn muốn xóa hình nền "${deletingWp.title}" không? Hành động này sẽ được cập nhật vào database.` : ''}
          />
        </>
      )}
    </Container>
  );
}

export default AdminPage;
