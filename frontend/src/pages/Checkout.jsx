import React from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Checkout</h2>
      <p>This demo handles final confirmation via the <strong>Cart</strong> page (select address + confirm).</p>
      <button onClick={() => navigate("/cart")}>Go to Cart</button>
    </div>
  );
}
