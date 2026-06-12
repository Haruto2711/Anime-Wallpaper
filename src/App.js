import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';

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
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-dark text-white">
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
              path="/admin" 
              element={<AdminPage />} 
            />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
