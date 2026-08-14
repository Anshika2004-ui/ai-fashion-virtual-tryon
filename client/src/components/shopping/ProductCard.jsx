import React from "react";
import "./shopping.css";

function ProductCard({ product, onTryOn }) {
  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <h3>{product.name}</h3>

      <p>₹{product.price}</p>

      <button
        onClick={() => onTryOn(product)}
      >
        👕 Try On
      </button>
    </div>
  );
}

export default ProductCard;