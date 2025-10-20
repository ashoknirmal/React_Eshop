import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (user) {
      loadOrders();
      loadAddresses();
    }
  }, [user]);

  async function loadOrders() {
    try {
      const r = await API.get(`/orders?userId=${user.uid}`);
      setOrders(r.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadAddresses() {
    try {
      const r = await API.get(`/addresses?userId=${user.uid}`);
      setAddresses(r.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function addAddress() {
    const label = prompt("Label (Home/Office)");
    const line1 = prompt("Address line 1");
    const city = prompt("City");
    const state = prompt("State");
    const pincode = prompt("Pincode");
    if (!line1 || !city) return alert("Address line and city required");
    const payload = {
      userId: user.uid,
      label: label || "Other",
      line1,
      city,
      state: state || "",
      pincode: pincode || ""
    };
    try {
      await API.post("/addresses", payload);
      loadAddresses();
    } catch (err) {
      console.error(err);
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "status-pending",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled"
    };
    return colors[status?.toLowerCase()] || "status-default";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h1 className="dashboard-title">My Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back, {user?.email?.split('@')[0] || 'User'}!</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{orders.length}</p>
              </div>
              <div className="stat-icon stat-icon-blue">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div>
                <p className="stat-label">Saved Addresses</p>
                <p className="stat-value">{addresses.length}</p>
              </div>
              <div className="stat-icon stat-icon-purple">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card-wide">
            <div className="stat-content">
              <div>
                <p className="stat-label">Total Spent</p>
                <p className="stat-value">
                  ₹{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="stat-icon stat-icon-green">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="main-grid">
          {/* Orders Section */}
          <section className="orders-section">
            <div className="section-card">
              <div className="section-header section-header-blue">
                <div className="section-header-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                  <h3 className="section-title">Recent Orders</h3>
                </div>
              </div>
              
              <div className="section-content">
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                    </div>
                    <p className="empty-text">No orders yet</p>
                    <p className="empty-subtext">Start shopping to see your orders here</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((o, idx) => (
                      <div
                        key={o.id}
                        className="order-card"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="order-content">
                          <div className="order-info">
                            <div className="order-header-row">
                              <span className="order-id">Order #{o.id}</span>
                              <span className={`order-status ${getStatusColor(o.status)}`}>
                                {o.status}
                              </span>
                            </div>
                            <p className="order-date">
                              Placed: {new Date(o.createdAt).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="order-total">
                            <p className="order-price">₹{o.total?.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Addresses */}
            <div className="section-card">
              <div className="section-header section-header-purple">
                <div className="section-header-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <h3 className="section-title">Addresses</h3>
                </div>
              </div>
              
              <div className="section-content">
                {addresses.length === 0 ? (
                  <div className="empty-state-small">
                    <div className="empty-icon-small">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <p className="empty-text-small">No addresses saved</p>
                  </div>
                ) : (
                  <div className="address-list">
                    {addresses.map((a, idx) => (
                      <div
                        key={a.id}
                        className="address-card"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <p className="address-label">{a.label}</p>
                        <p className="address-line">{a.line1}</p>
                        <p className="address-line">{a.city}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <button onClick={addAddress} className="add-button add-button-purple">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add New Address
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="section-card">
              <div className="section-header section-header-indigo">
                <h3 className="section-title">Quick Links</h3>
              </div>
              
              <div className="section-content quick-links">
                <Link to="/wishlist" className="quick-link quick-link-red">
                  <div className="quick-link-icon quick-link-icon-red">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </div>
                  <span className="quick-link-text">My Wishlist</span>
                </Link>

                <Link to="/cart" className="quick-link quick-link-blue">
                  <div className="quick-link-icon quick-link-icon-blue">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </div>
                  <span className="quick-link-text">My Cart</span>
                </Link>
              </div>
            </div>
          </aside>
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%);
          padding: 2rem 1rem;
        }

        .dashboard-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 3rem;
          animation: fadeIn 0.6s ease-out;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
          color: white;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #4338ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .dashboard-subtitle {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0.25rem 0 0 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
        }

        @media (min-width: 640px) {
          .stat-card-wide {
            grid-column: span 2;
          }
        }

        @media (min-width: 1024px) {
          .stat-card-wide {
            grid-column: span 1;
          }
        }

        .stat-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0 0 0.5rem 0;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .stat-icon-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .stat-icon-purple {
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
        }

        .stat-icon-green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .main-grid {
            grid-template-columns: 2fr 1fr;
          }
        }

        .orders-section {
          width: 100%;
        }

        .section-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .section-header {
          padding: 1.5rem 2rem;
        }

        .section-header-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
        }

        .section-header-purple {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
        }

        .section-header-indigo {
          background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
        }

        .section-header-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .section-header svg {
          color: white;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .section-content {
          padding: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .empty-text {
          color: #64748b;
          font-size: 1.125rem;
          font-weight: 500;
          margin: 0;
        }

        .empty-subtext {
          color: #94a3b8;
          font-size: 0.875rem;
          margin: 0.5rem 0 0 0;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-card {
          background: linear-gradient(135deg, #f8fafc 0%, white 100%);
          border-radius: 0.75rem;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out backwards;
        }

        .order-card:hover {
          border-color: #93c5fd;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
        }

        .order-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .order-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .order-info {
          flex: 1;
        }

        .order-header-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .order-id {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1e293b;
        }

        .order-status {
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
          border-color: #fde68a;
        }

        .status-processing {
          background: #dbeafe;
          color: #1e40af;
          border-color: #bfdbfe;
        }

        .status-shipped {
          background: #e9d5ff;
          color: #6b21a8;
          border-color: #d8b4fe;
        }

        .status-delivered {
          background: #d1fae5;
          color: #065f46;
          border-color: #a7f3d0;
        }

        .status-cancelled {
          background: #fee2e2;
          color: #991b1b;
          border-color: #fecaca;
        }

        .status-default {
          background: #f1f5f9;
          color: #475569;
          border-color: #e2e8f0;
        }

        .order-date {
          color: #64748b;
          font-size: 0.875rem;
          margin: 0;
        }

        .order-total {
          text-align: left;
        }

        @media (min-width: 640px) {
          .order-total {
            text-align: right;
          }
        }

        .order-price {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .empty-state-small {
          text-align: center;
          padding: 2rem 1rem;
        }

        .empty-icon-small {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: #f3e8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a855f7;
        }

        .empty-text-small {
          color: #64748b;
          font-size: 0.875rem;
          margin: 0;
        }

        .address-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .address-card {
          background: linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%);
          border-radius: 0.5rem;
          padding: 1rem;
          border: 1px solid #e9d5ff;
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out backwards;
        }

        .address-card:hover {
          border-color: #d8b4fe;
        }

        .address-label {
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .address-line {
          color: #64748b;
          font-size: 0.875rem;
          margin: 0;
        }

        .add-button {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-weight: 600;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .add-button:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }

        .add-button-purple {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
        }

        .add-button-purple:hover {
          background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
        }

        .quick-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .quick-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 0.75rem;
          padding: 1rem;
          border: 1px solid;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .quick-link-red {
          background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);
          border-color: #fecaca;
        }

        .quick-link-red:hover {
          background: linear-gradient(135deg, #fee2e2 0%, #fce7f3 100%);
          border-color: #fca5a5;
        }

        .quick-link-blue {
          background: linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%);
          border-color: #bfdbfe;
        }

        .quick-link-blue:hover {
          background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
          border-color: #93c5fd;
        }

        .quick-link-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: transform 0.3s ease;
        }

        .quick-link:hover .quick-link-icon {
          transform: scale(1.1);
        }

        .quick-link-icon-red {
          background: linear-gradient(135deg, #ef4444 0%, #ec4899 100%);
        }

        .quick-link-icon-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
        }

        .quick-link-text {
          font-weight: 600;
          color: #1e293b;
        }

        @media (min-width: 640px) {
          .dashboard-container {
            padding: 3rem 1.5rem;
          }

          .dashboard-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 639px) {
          .section-content {
            padding: 1.5rem;
          }

          .stat-card {
            padding: 1.25rem;
          }

          .order-card {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}