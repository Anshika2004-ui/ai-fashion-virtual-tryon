import React from "react";

function ChatHeader({
  title,
  darkMode,
  setDarkMode,
  onClear,
  onClose,
  fileInputRef,
}) {
  return (
    <div
      className="chat-header"
      style={{
        background: "#10a37f",
        color: "white",
        padding: "15px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left */}
      <div>
        <h3
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          🤖 {title}
        </h3>

        <span
          style={{
            fontSize: "13px",
            opacity: 0.9,
          }}
        >
          🟢 Online
        </span>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          fontSize: "22px",
          cursor: "pointer",
        }}
      >
        {/* Upload */}
        {fileInputRef && (
          <>
            <span
              title="Upload Photo"
              onClick={() => fileInputRef.current.click()}
            >
              📸
            </span>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </>
        )}

        {/* Dark Mode */}
        <span
          title="Theme"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </span>

        {/* Clear */}
        <span
          title="Clear Chat"
          onClick={onClear}
        >
          🗑️
        </span>

        {/* Close */}
        <span
          title="Close"
          onClick={onClose}
        >
          ❌
        </span>
      </div>
    </div>
  );
}

export default ChatHeader;