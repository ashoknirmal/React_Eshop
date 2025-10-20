import React from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/" replace />;

  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}