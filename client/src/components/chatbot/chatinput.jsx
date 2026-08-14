import React, { useRef } from "react";

function ChatInput({
  message,
  setMessage,
  sendMessage,
  selectedImage,
  handleImageUpload,
  loading,
}) {
  const fileInputRef = useRef(null);

  return (
    <div
      style={{
        padding: "10px",
        borderTop: "1px solid #ddd",
        background: "#fff",
      }}
    >
      {/* Image Preview */}
      {selectedImage && (
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={selectedImage}
            alt="Preview"
            style={{
              width: "90px",
              height: "90px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "2px solid #10a37f",
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            console.log("Selected:", e.target.files[0]);
            handleImageUpload(e);
          }}
        />

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            background: "#10a37f",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 12px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📷 Upload
        </button>

        {/* Message Input */}
        <input
          type="text"
          placeholder="Type here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "25px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        {/* Send Button */}
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "none",
            background: "#10a37f",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default ChatInput;