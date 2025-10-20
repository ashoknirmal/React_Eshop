import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, MapPin, ShoppingBag, CheckCircle } from "lucide-react";
import API from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [itemsDetails, setItemsDetails] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();
      loadAddresses();
    }
  }, [user]);

  async function loadCart() {
    try {
      const r = await API.get(`/carts?userId=${user.uid}`);
      const c = r.data[0];
      setCart(c || { items: [] });
      if (c && c.items.length) {
        const proms = c.items.map((it) => API.get(`/products/${it.productId}`));
        const res = await Promise.all(proms);
        const details = c.items.map((it, idx) => ({ ...res[idx].data, quantity: it.quantity }));
        setItemsDetails(details);
      } else {
        setItemsDetails([]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadAddresses() {
    try {
      const r = await API.get(`/addresses?userId=${user.uid}`);
      setAddresses(r.data || []);
      if (r.data && r.data.length) setSelectedAddressId(r.data[0].id);
    } catch (err) {
      console.error(err);
    }
  }

  function total() {
    return itemsDetails.reduce((s, it) => s + it.price * it.quantity, 0);
  }

  async function confirmOrder() {
    if (!selectedAddressId) return alert("Select address");
    if (!cart || !cart.items.length) return alert("Cart is empty");

    setLoading(true);
    const itemsWithPrice = cart.items.map((it) => {
      const product = itemsDetails.find((p) => p.id === it.productId);
      return { productId: it.productId, quantity: it.quantity, price: product ? product.price : 0 };
    });

    const order = {
      userId: user.uid,
      items: itemsWithPrice,
      addressId: selectedAddressId,
      total: itemsWithPrice.reduce((s, i) => s + i.price * i.quantity, 0),
      status: "On Process",
      createdAt: new Date().toISOString()
    };

    try {
      await API.post("/orders", order);
      for (const it of cart.items) {
        const prodRes = await API.get(`/products/${it.productId}`);
        const prod = prodRes.data;
        const newStock = Math.max(0, prod.stock - it.quantity);
        await API.patch(`/products/${prod.id}`, { stock: newStock });
      }
      await API.delete(`/carts/${cart.id}`);
      alert("Order confirmed!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId) {
    if (!cart) return;
    const c = { ...cart };
    c.items = c.items.filter((it) => it.productId !== productId);
    if (c.items.length === 0) {
      await API.delete(`/carts/${cart.id}`);
      setCart({ items: [] });
      setItemsDetails([]);
    } else {
      await API.patch(`/carts/${cart.id}`, { items: c.items });
      loadCart();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Shopping Cart
            </span>
          </h1>
          <p className="text-xl text-gray-600">Review your items and checkout</p>
        </motion.div>

        {itemsDetails.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-lg"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={64} className="text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping and add items to your cart</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold shadow-lg"
            >
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {itemsDetails.map((it) => (
                  <motion.div
                    key={it.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-bold text-gray-800">{it.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{it.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-600">Quantity: <span className="font-semibold">{it.quantity}</span></span>
                          <span className="text-2xl font-bold text-purple-600">₹{it.price * it.quantity}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeItem(it.id)}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors self-start"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Address Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-purple-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">Delivery Address</h3>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">No addresses found</p>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="text-purple-600 font-semibold hover:underline"
                    >
                      Add one in Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((a) => (
                      <label
                        key={a.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddressId === a.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === a.id}
                          onChange={() => setSelectedAddressId(a.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{a.label}</div>
                          <div className="text-sm text-gray-600">{a.line1}, {a.city}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Price Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{total()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="border-t-2 border-gray-100 pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">₹{total()}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmOrder}
                  disabled={loading || !selectedAddressId}
                  className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Confirm Order
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  No payment required for demo
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}