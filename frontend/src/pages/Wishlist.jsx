import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function Wishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState({ productIds: [] });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (user) loadWishlist();
  }, [user]);

  async function loadWishlist() {
    setLoading(true);
    try {
      const r = await API.get(`/wishlists?userId=${user.uid}`);
      if (r.data.length === 0) {
        setWishlist({ productIds: [] });
        setProducts([]);
        return;
      }
      const w = r.data[0];
      setWishlist(w);
      if (w.productIds.length) {
        const proms = w.productIds.map((id) => API.get(`/products/${id}`));
        const res = await Promise.all(proms);
        setProducts(res.map((r) => r.data));
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(productId) {
    setRemovingId(productId);
    try {
      const r = await API.get(`/wishlists?userId=${user.uid}`);
      if (r.data.length === 0) return;
      const w = r.data[0];
      const filtered = w.productIds.filter((p) => p !== productId);
      await API.patch(`/wishlists/${w.id}`, { productIds: filtered });
      loadWishlist();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-wrapper">
        {/* Header */}
        <div className="wishlist-header">
          <div className="header-content">
            <div className="wishlist-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div>
              <h1 className="wishlist-title">My Wishlist</h1>
              <p className="wishlist-subtitle">
                {products.length} {products.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-icon stat-icon-pink">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div>
              <p className="stat-label">Total Items</p>
              <p className="stat-value">{products.length}</p>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon stat-icon-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div>
              <p className="stat-label">Total Value</p>
              <p className="stat-value">₹{products.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="wishlist-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">Loading your wishlist...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3 className="empty-title">Your wishlist is empty</h3>
              <p className="empty-text">Start adding items you love to your wishlist</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p, idx) => (
                <div
                  key={p.id}
                  className="product-card"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="product-image"
                    />
                    <div className="product-overlay">
                      <button
                        onClick={() => removeFromWishlist(p.id)}
                        disabled={removingId === p.id}
                        className="remove-btn"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-title">{p.title}</h3>
                    {p.description && (
                      <p className="product-description">{p.description}</p>
                    )}
                    
                    <div className="product-footer">
                      <div className="price-section">
                        <p className="product-price">₹{p.price?.toLocaleString()}</p>
                        {p.stock !== undefined && (
                          <span className={`stock-badge ${p.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                            {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromWishlist(p.id)}
                        disabled={removingId === p.id}
                        className="remove-button"
                      >
                        {removingId === p.id ? (
                          <>
                            <div className="btn-spinner"></div>
                            Removing...
                          </>
                        ) : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .wishlist-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%);
          padding: 2rem 1rem;
        }

        .wishlist-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .wishlist-header {
          margin-bottom: 2rem;
          animation: fadeIn 0.6s ease-out;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .wishlist-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(236, 72, 153, 0.4);
          color: white;
          animation: heartbeat 2s ease-in-out infinite;
        }

        .wishlist-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #be185d 0%, #ec4899 50%, #f43f5e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .wishlist-subtitle {
          color: #9f1239;
          font-size: 0.95rem;
          margin: 0.25rem 0 0 0;
          font-weight: 500;
        }

        .stats-card {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .stats-card {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stat-item {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(236, 72, 153, 0.1);
          border: 1px solid rgba(236, 72, 153, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          box-shadow: 0 10px 40px rgba(236, 72, 153, 0.2);
          transform: translateY(-4px);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .stat-icon-pink {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
        }

        .stat-icon-purple {
          background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0 0 0.25rem 0;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #be185d 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .wishlist-content {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 10px 40px rgba(236, 72, 153, 0.1);
          border: 1px solid rgba(236, 72, 153, 0.1);
          padding: 2rem;
          min-height: 400px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #fce7f3;
          border-top-color: #ec4899;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .loading-text {
          color: #9f1239;
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          width: 120px;
          height: 120px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ec4899;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #be185d;
          margin: 0 0 0.5rem 0;
        }

        .empty-text {
          color: #9f1239;
          font-size: 1rem;
          margin: 0;
        }

        .products-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .product-card {
          background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid rgba(236, 72, 153, 0.1);
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out backwards;
        }

        .product-card:hover {
          box-shadow: 0 15px 40px rgba(236, 72, 153, 0.2);
          transform: translateY(-8px);
          border-color: #fbcfe8;
        }

        .product-image-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #fce7f3 100%);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.1);
        }

        .product-overlay {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.75rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .remove-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.95);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }

        .remove-btn:hover:not(:disabled) {
          background: #dc2626;
          transform: scale(1.1) rotate(90deg);
        }

        .remove-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .product-info {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .product-title {
          font-size: 1.125rem;
          font-weight: 700;
          background: linear-gradient(135deg, #be185d 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          line-height: 1.4;
        }

        .product-description {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-footer {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: auto;
        }

        .price-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #be185d 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .stock-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
        }

        .stock-badge.in-stock {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }

        .stock-badge.out-stock {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
        }

        .remove-button {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .remove-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
          transform: translateY(-2px);
        }

        .remove-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .remove-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @media (min-width: 640px) {
          .wishlist-container {
            padding: 3rem 1.5rem;
          }

          .wishlist-title {
            font-size: 2.5rem;
          }

          .wishlist-content {
            padding: 2.5rem;
          }
        }

        @media (max-width: 639px) {
          .wishlist-header {
            margin-bottom: 1.5rem;
          }

          .wishlist-icon {
            width: 48px;
            height: 48px;
          }

          .wishlist-title {
            font-size: 1.75rem;
          }

          .wishlist-content {
            padding: 1.5rem;
          }

          .product-image-wrapper {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
}