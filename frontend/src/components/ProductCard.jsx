import React, { useState } from "react";
import toast from "react-hot-toast";
import API from "../api/api";

export default function ProductCard({ product, user, onCartUpdated }) {
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  async function addToCart() {
    if (!user) return toast.error("Please login to add to cart.");
    if (product.stock === 0) return toast.error("Product is out of stock.");
    setLoadingCart(true);
    try {
      const r = await API.get(`/carts?userId=${user.uid}`);
      if (r.data.length === 0) {
        const newCart = {
          userId: user.uid,
          items: [{ productId: product.id, quantity: 1 }],
        };
        await API.post("/carts", newCart);
      } else {
        const cart = r.data[0];
        const existing = cart.items.find((i) => i.productId === product.id);
        if (existing) existing.quantity += 1;
        else cart.items.push({ productId: product.id, quantity: 1 });
        await API.patch(`/carts/${cart.id}`, { items: cart.items });
      }
      onCartUpdated && onCartUpdated();
      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart.");
    } finally {
      setLoadingCart(false);
    }
  }

  async function addToWishlist() {
    if (!user) return toast.error("Please login to add to wishlist.");
    if (product.stock === 0)
      return toast.error("Cannot wishlist out of stock product.");
    setLoadingWishlist(true);
    try {
      const r = await API.get(`/wishlists?userId=${user.uid}`);
      if (r.data.length === 0) {
        await API.post("/wishlists", {
          userId: user.uid,
          productIds: [product.id],
        });
      } else {
        const w = r.data[0];
        if (!w.productIds.includes(product.id)) {
          w.productIds.push(product.id);
          await API.patch(`/wishlists/${w.id}`, { productIds: w.productIds });
        }
      }
      toast.success("Added to wishlist!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to wishlist.");
    } finally {
      setLoadingWishlist(false);
    }
  }

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.title}
          className={`product-image ${isHovered ? 'image-hovered' : ''}`}
        />
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-text">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h4 className="product-title">{product.title}</h4>
        <p className="product-description">{product.description}</p>
        
        <div className="product-details">
          <p className="product-price">₹{product.price?.toLocaleString()}</p>
          <div className="stock-badge-wrapper">
            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-actions">
        <button
          onClick={addToCart}
          disabled={product.stock === 0 || loadingCart}
          className={`action-btn cart-btn ${product.stock === 0 || loadingCart ? 'btn-disabled' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {loadingCart ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>

        <button
          onClick={addToWishlist}
          disabled={product.stock === 0 || loadingWishlist}
          className={`action-btn wishlist-btn ${product.stock === 0 || loadingWishlist ? 'btn-disabled' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {loadingWishlist ? "Saving..." : "Wishlist"}
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .product-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
          backdrop-filter: blur(20px);
          border-radius: 1.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 28rem;
          width: 100%;
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.6s ease-out;
          position: relative;
          overflow: hidden;
        }

        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .product-card:hover::before {
          left: 100%;
        }

        .product-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(139, 92, 246, 0.25), 
                      0 0 0 1px rgba(139, 92, 246, 0.1);
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        }

        .product-image {
          width: 100%;
          height: 13rem;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-hovered {
          transform: scale(1.15) rotate(2deg);
        }

        .out-of-stock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .out-of-stock-text {
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-radius: 0.5rem;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
        }

        .product-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .product-title {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.4;
          transition: transform 0.3s ease;
          cursor: pointer;
          margin: 0;
        }

        .product-title:hover {
          transform: translateX(4px);
        }

        .product-description {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: auto;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .stock-badge-wrapper {
          display: flex;
          align-items: center;
        }

        .stock-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          display: inline-block;
        }

        .stock-badge.in-stock {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
        }

        .stock-badge.out-stock {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
        }

        .product-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .action-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .action-btn:active {
          transform: scale(0.95);
        }

        .cart-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .cart-btn:hover:not(.btn-disabled) {
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
          transform: translateY(-2px);
        }

        .wishlist-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .wishlist-btn:hover:not(.btn-disabled) {
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
          transform: translateY(-2px);
        }

        .btn-disabled {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          color: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-disabled:hover {
          transform: none;
          box-shadow: none;
        }

        .action-btn svg {
          position: relative;
          z-index: 1;
        }

        .action-btn span {
          position: relative;
          z-index: 1;
        }

        /* Loading state animation */
        .action-btn:disabled {
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .product-card {
            padding: 1.25rem;
            max-width: 100%;
          }

          .product-image {
            height: 12rem;
          }

          .product-title {
            font-size: 1.125rem;
          }

          .product-price {
            font-size: 1.25rem;
          }

          .product-actions {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .product-card {
            max-width: 24rem;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .product-card {
            background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.85) 100%);
            border: 1px solid rgba(75, 85, 99, 0.3);
          }

          .product-description {
            color: #9ca3af;
          }

          .product-image-wrapper {
            background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          }
        }
      `}</style>
    </div>
  );
}