import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
