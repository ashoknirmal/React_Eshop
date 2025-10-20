import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Package, TrendingUp, Users, Clock } from "lucide-react";
import API from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function Admin() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, revenue: 0, pending: 0, delivered: 0 });

  useEffect(() => {
    if (user && user.isAdmin) loadOrders();
  }, [user]);

  async function loadOrders() {
    try {
      const r = await API.get("/orders");
      const ordersData = r.data || [];
      setOrders(ordersData);
      
      // Calculate stats
      const total = ordersData.length;
      const revenue = ordersData.reduce((sum, o) => sum + o.total, 0);
      const pending = ordersData.filter(o => o.status === "On Process").length;
      const delivered = ordersData.filter(o => o.status === "Delivered").length;
      setStats({ total, revenue, pending, delivered });
    } catch (err) {
      console.error(err);
    }
  }

  async function changeStatus(orderId, status) {
    try {
      await API.patch(`/orders/${orderId}`, { status });
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={48} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">This area is restricted to administrators only.</p>
        </motion.div>
      </div>
    );
  }

  const statusOptions = [
    { value: "On Process", color: "from-blue-500 to-indigo-500" },
    { value: "Shipped", color: "from-purple-500 to-pink-500" },
    { value: "Delivered", color: "from-green-500 to-emerald-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Admin Panel
                </span>
              </h1>
              <p className="text-gray-600">Manage orders and track performance</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: <Package size={28} />, label: "Total Orders", value: stats.total, color: "from-blue-500 to-indigo-500" },
            { icon: <TrendingUp size={28} />, label: "Revenue", value: `₹${stats.revenue}`, color: "from-green-500 to-emerald-500" },
            { icon: <Clock size={28} />, label: "Pending", value: stats.pending, color: "from-orange-500 to-red-500" },
            { icon: <Users size={28} />, label: "Delivered", value: stats.delivered, color: "from-purple-500 to-pink-500" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="opacity-80">{stat.icon}</div>
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Package size={28} />
              Order Management
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package size={48} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600">Orders will appear here once customers start purchasing</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((o, idx) => (
                    <motion.tr
                      key={o.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-purple-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">#{o.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{o.userId.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-purple-600">₹{o.total}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          o.status === "Delivered" 
                            ? "bg-green-100 text-green-700" 
                            : o.status === "Shipped" 
                            ? "bg-purple-100 text-purple-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {statusOptions.map((status) => (
                            <motion.button
                              key={status.value}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => changeStatus(o.id, status.value)}
                              disabled={o.status === status.value}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${status.color}`}
                            >
                              {status.value}
                            </motion.button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}