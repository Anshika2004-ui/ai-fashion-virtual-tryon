import React from "react";

function FloatingButton({
  onClick,
  primaryColor,
  positionStyle,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...positionStyle,
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        border: "none",
        background: primaryColor,
        color: "white",
        fontSize: "28px",
        cursor: "pointer",
        boxShadow: "0 5px 15px rgba(0,0,0,.3)",
      }}
    >
      💬
    </button>
  );
}

export default FloatingButton;