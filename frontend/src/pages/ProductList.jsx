import React, { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";
import SearchSort from "../components/SearchSort";
import { useAuth } from "../contexts/AuthContext";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function filtered() {
    let arr = products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "price_asc") arr = arr.slice().sort((a, b) => a.price - b.price);
    if (sort === "price_desc") arr = arr.slice().sort((a, b) => b.price - a.price);
    if (sort === "title_asc") arr = arr.slice().sort((a, b) => a.title.localeCompare(b.title));
    return arr;
  }

  return (
    <div>
      <h2>Products</h2>
      <SearchSort search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
      <div className="grid">
        {filtered().map((p) => (
          <ProductCard key={p.id} product={p} user={user} onCartUpdated={fetchProducts} />
        ))}
      </div>
    </div>
  );
}
