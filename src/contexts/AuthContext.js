import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initialization
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Lỗi khi đọc auth_user từ localStorage:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const res = await fetch(`http://localhost:4000/users?username=${username}`);
      if (!res.ok) throw new Error("Lỗi mạng, vui lòng thử lại.");
      
      const users = await res.json();
      const matchedUser = users.find(u => u.username === username && u.password === password);
      
      if (matchedUser) {
        const userInfo = {
          id: matchedUser.id,
          username: matchedUser.username,
          role: matchedUser.role,
          email: matchedUser.email
        };
        setUser(userInfo);
        localStorage.setItem('auth_user', JSON.stringify(userInfo));
        return { success: true };
      } else {
        return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      // 1. Check if username already exists
      const checkRes = await fetch(`http://localhost:4000/users?username=${username}`);
      if (!checkRes.ok) throw new Error("Lỗi mạng, không thể kiểm tra tài khoản.");
      
      const existingUsers = await checkRes.json();
      if (existingUsers.length > 0) {
        return { success: false, message: 'Tên đăng nhập đã tồn tại.' };
      }

      // 2. Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        username,
        email,
        password,
        role: 'user' // default role
      };

      const saveRes = await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (!saveRes.ok) throw new Error("Lỗi mạng, không thể đăng ký tài khoản.");
      
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message || 'Không thể kết nối đến máy chủ.' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
