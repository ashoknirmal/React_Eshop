import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Get cart count from localStorage or your cart context
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(totalItems);
      } catch (error) {
        console.error('Error reading cart:', error);
        setCartCount(0);
      }
    };

    // Update cart count on mount
    updateCartCount();

    // Listen for cart updates (custom event)
    window.addEventListener('cartUpdated', updateCartCount);
    
    // Also listen for storage changes
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  // Check if user is admin
  const isAdmin = user?.isAdmin === true;
  // Check if user is normal user (logged in but not admin)
  const isNormalUser = user && !isAdmin;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="logo-wrapper">
            <Link to="/" className="logo-link">
              <div className="logo-icon">
                <span className="logo-text">E</span>
              </div>
              <span className="logo-title">E-Shop</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            {/* Show Products, Cart, Wishlist only for non-admin users or not logged in */}
            {!isAdmin && (
              <>
                <div className="nav-link-wrapper">
                  <Link to="/products" className="nav-link">
                    Products
                    <span className="nav-underline"></span>
                  </Link>
                </div>

                <div className="icon-link-wrapper">
                  <Link to="/cart" className="icon-link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </Link>
                </div>

                <div className="icon-link-wrapper">
                  <Link to="/wishlist" className="icon-link wishlist-link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </Link>
                </div>
              </>
            )}

            {user ? (
              <>
                {/* Show Dashboard button only for normal users */}
                {isNormalUser && (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="user-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>{user.name}</span>
                  </button>
                )}

                {/* Show Admin button only for admin users */}
                {isAdmin && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="admin-btn"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>{user.name || 'Admin'}</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="login-btn"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="mobile-menu-content">
          {/* Show Products, Cart, Wishlist only for non-admin users */}
          {!isAdmin && (
            <>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link"
              >
                Products
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link mobile-link-icon"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-link mobile-link-icon mobile-link-wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Wishlist
              </Link>
            </>
          )}

          {user ? (
            <>
              {/* Show Dashboard for normal users */}
              {isNormalUser && (
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-btn mobile-user-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {user.name}
                </button>
              )}

              {/* Show Admin Panel for admin users */}
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-btn mobile-admin-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Admin Panel
                </button>
              )}

              <button
                onClick={handleLogout}
                className="mobile-btn mobile-logout-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="mobile-btn mobile-login-btn"
            >
              Login
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInMobile {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: auto;
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
          animation: slideDown 0.6s ease-out;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 64px;
        }

        .logo-wrapper {
          transition: transform 0.3s ease;
        }

        .logo-wrapper:hover {
          transform: scale(1.05);
        }

        .logo-wrapper:active {
          transform: scale(0.95);
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .logo-text {
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .logo-title {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .desktop-nav {
          display: none;
          align-items: center;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }

          .logo-title {
            font-size: 1.5rem;
          }
        }

        .nav-link-wrapper {
          transition: transform 0.2s ease;
        }

        .nav-link-wrapper:hover {
          transform: translateY(-2px);
        }

        .nav-link {
          position: relative;
          color: #374151;
          font-weight: 500;
          text-decoration: none;
          padding: 0.5rem 0.75rem;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #8b5cf6;
        }

        .nav-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
          transition: width 0.3s ease;
        }

        .nav-link:hover .nav-underline {
          width: 100%;
        }

        .icon-link-wrapper {
          transition: transform 0.3s ease;
        }

        .icon-link-wrapper:hover {
          transform: scale(1.1);
        }

        .icon-link-wrapper:active {
          transform: scale(0.9);
        }

        .icon-link {
          position: relative;
          padding: 0.5rem;
          color: #374151;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: color 0.3s ease;
        }

        .icon-link:hover {
          color: #8b5cf6;
        }

        .wishlist-link:hover {
          color: #ec4899;
        }

        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          background: linear-gradient(135deg, #ec4899 0%, #f97316 100%);
          border-radius: 50%;
          color: white;
          font-size: 0.625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }

        .user-btn,
        .admin-btn,
        .logout-btn,
        .login-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          height: 40px;
          font-size: 0.875rem;
        }

        .user-btn:hover,
        .admin-btn:hover,
        .logout-btn:hover,
        .login-btn:hover {
          transform: scale(1.05);
        }

        .user-btn:active,
        .admin-btn:active,
        .logout-btn:active,
        .login-btn:active {
          transform: scale(0.95);
        }

        .user-btn {
          background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
          color: #7c3aed;
        }

        .user-btn:hover {
          background: linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 100%);
        }

        .admin-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .admin-btn:hover {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .logout-btn {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(75, 85, 99, 0.3);
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          box-shadow: 0 6px 20px rgba(75, 85, 99, 0.4);
        }

        .login-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .login-btn:hover {
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          background: none;
          border: none;
          color: #374151;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .mobile-menu-btn:hover {
          color: #8b5cf6;
        }

        .mobile-menu-btn:active {
          transform: scale(0.9);
        }

        .mobile-menu {
          display: block;
          overflow: hidden;
          background: white;
          border-top: 1px solid rgba(139, 92, 246, 0.1);
          max-height: 0;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        @media (min-width: 768px) {
          .mobile-menu {
            display: none;
          }
        }

        .mobile-menu-open {
          max-height: 500px;
          opacity: 1;
        }

        .mobile-menu-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-link {
          display: block;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          color: #374151;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .mobile-link:hover {
          background: #f3e8ff;
          color: #8b5cf6;
        }

        .mobile-link-icon {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mobile-link-wishlist:hover {
          background: #fce7f3;
          color: #ec4899;
        }

        .mobile-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          height: 48px;
        }

        .mobile-user-btn {
          background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
          color: #7c3aed;
        }

        .mobile-admin-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .mobile-logout-btn {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(75, 85, 99, 0.3);
        }

        .mobile-login-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        @media (min-width: 640px) {
          .navbar-container {
            padding: 0 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .navbar-container {
            padding: 0 2rem;
          }
        }
      `}</style>
    </nav>
  );
}