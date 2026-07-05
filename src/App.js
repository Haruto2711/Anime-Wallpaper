import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { Bell } from 'lucide-react';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import SakuraBackground from './components/ui/SakuraBackground';
import './App.css';

function AppContent({ favorites, handleToggleFavorite }) {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  const knownWpIdsRef = useRef(new Set());

  // Initial fetch to establish known wallpapers
  useEffect(() => {
    fetch('http://localhost:4000/wallpapers')
      .then(res => res.json())
      .then(data => {
        const currentIds = data.map(wp => wp.id);
        const savedIdsJson = localStorage.getItem('known_wallpaper_ids');
        
        if (savedIdsJson) {
          // User has visited before. Check for new wallpapers added since their last session!
          const savedIdsArray = JSON.parse(savedIdsJson);
          const savedIdsSet = new Set(savedIdsArray);
          
          const newItems = data.filter(wp => !savedIdsSet.has(wp.id));
          
          if (newItems.length > 0) {
            // Trigger toasts and dispatch events for new offline-added wallpapers
            newItems.forEach(newWp => {
              // Dispatch custom event for Header notification badge
              window.dispatchEvent(new CustomEvent('new-wallpaper-uploaded', { detail: newWp }));

              setToasts(prev => [
                ...prev,
                {
                  id: newWp.id,
                  title: newWp.title,
                  anime: newWp.anime,
                  author: newWp.author || 'Minh Thanh',
                  imageUrl: newWp.imageUrl,
                  timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            });
            
            // Add new items to saved set
            newItems.forEach(wp => savedIdsSet.add(wp.id));
          }
          
          knownWpIdsRef.current = savedIdsSet;
          localStorage.setItem('known_wallpaper_ids', JSON.stringify(Array.from(savedIdsSet)));
        } else {
          // First time visit: just save all current wallpapers as known to prevent spamming
          const idsSet = new Set(currentIds);
          knownWpIdsRef.current = idsSet;
          localStorage.setItem('known_wallpaper_ids', JSON.stringify(currentIds));
        }
      })
      .catch(err => console.error("Error setting initial wallpapers for notifications", err));
  }, []);

  // Poll for new wallpapers
  useEffect(() => {
    const interval = setInterval(() => {
      // Wait until initial set of wallpapers has loaded
      if (knownWpIdsRef.current.size === 0) return;

      fetch('http://localhost:4000/wallpapers')
        .then(res => res.json())
        .then(data => {
          const newItems = data.filter(wp => !knownWpIdsRef.current.has(wp.id));
          
          if (newItems.length > 0) {
            // Update ref immediately to prevent showing duplicate toasts
            newItems.forEach(wp => {
              knownWpIdsRef.current.add(wp.id);
            });
            
            // Sync to localStorage
            localStorage.setItem('known_wallpaper_ids', JSON.stringify(Array.from(knownWpIdsRef.current)));

            newItems.forEach(newWp => {
              // Dispatch custom event for Header notification badge
              window.dispatchEvent(new CustomEvent('new-wallpaper-uploaded', { detail: newWp }));

              setToasts(prev => [
                ...prev,
                {
                  id: newWp.id,
                  title: newWp.title,
                  anime: newWp.anime,
                  author: newWp.author || 'Minh Thanh',
                  imageUrl: newWp.imageUrl,
                  timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            });
          }
        })
        .catch(err => console.error("Error checking for new wallpapers", err));
    }, 8000); // Check every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <SakuraBackground />
      {/* Navigation Bar */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-grow-1">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                favorites={favorites} 
                onToggleFavorite={handleToggleFavorite} 
              />
            } 
          />
          <Route 
            path="/wallpaper/:id" 
            element={
              <DetailPage 
                favorites={favorites} 
                onToggleFavorite={handleToggleFavorite} 
              />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <FavoritesPage 
                favorites={favorites} 
                onToggleFavorite={handleToggleFavorite} 
              />
            } 
          />
          <Route 
            path="/login" 
            element={<LoginPage />} 
          />
          <Route 
            path="/register" 
            element={<RegisterPage />} 
          />
          
          {/* Protect Admin route: Only admins allowed */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Toast Notification Container */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1050, position: 'fixed' }}>
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            onClose={() => removeToast(toast.id)} 
            delay={8000} 
            autohide
            onClick={() => {
              navigate(`/wallpaper/${toast.id}`);
              removeToast(toast.id);
            }}
            style={{ cursor: 'pointer', backgroundColor: 'rgba(30, 30, 40, 0.95)', border: '1px solid var(--sakura-primary, #ff85a2)' }}
            className="text-white shadow-lg"
          >
            <Toast.Header className="bg-dark text-white border-bottom border-secondary d-flex justify-content-between align-items-center">
              <span className="d-flex align-items-center gap-2 font-weight-bold" style={{ color: 'var(--sakura-primary, #ff85a2)' }}>
                <Bell size={16} className="text-warning pulse" />
                <span>Ảnh mới tải lên!</span>
              </span>
              <small className="text-white-50 ms-auto">{toast.timestamp}</small>
            </Toast.Header>
            <Toast.Body className="d-flex align-items-center gap-3">
              <img 
                src={process.env.PUBLIC_URL + toast.imageUrl} 
                alt={toast.title} 
                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <div>
                <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{toast.title}</div>
                <small className="text-white-50 d-block text-truncate" style={{ maxWidth: '200px' }}>Tác giả: {toast.author}</small>
              </div>
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </div>
  );
}

function App() {
  // Global favorites state initialized from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavs = localStorage.getItem('fav_wallpapers');
      return savedFavs ? JSON.parse(savedFavs) : [];
    } catch (e) {
      console.error("Lỗi khi đọc favorites từ localStorage", e);
      return [];
    }
  });

  // Sync favorites with localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('fav_wallpapers', JSON.stringify(favorites));
    } catch (e) {
      console.error("Lỗi khi lưu favorites vào localStorage", e);
    }
  }, [favorites]);

  // Global image protection: Disable right-click & drag on all images
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Handler to add/remove a wallpaper from favorites
  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); // Remove
      } else {
        return [...prev, id]; // Add
      }
    });
  };

  return (
    <AuthProvider>
      <Router>
        <AppContent favorites={favorites} handleToggleFavorite={handleToggleFavorite} />
      </Router>
    </AuthProvider>
  );
}

export default App;
