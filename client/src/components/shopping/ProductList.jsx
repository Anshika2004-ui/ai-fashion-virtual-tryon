import React from "react";
import ProductCard from "./ProductCard";
import products from "./products";

function ProductList({ onTryOn }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onTryOn={onTryOn}
        />
      ))}
    </div>
  );
}

export default ProductList;