import React from "react";
import "./chatbot.css";

const ChatBody = ({
  messages,
  loading,
  welcomeMessage,
  chatEndRef,
  tryOnResult,
}) => {
  return (
    <div className="chat-body">

      {/* =========================
          WELCOME MESSAGE
      ========================== */}
      {messages.length === 0 && (
        <div className="bot-message">
          <div className="message-text">
            {welcomeMessage || "Ask me anything!"}
          </div>
        </div>
      )}

      {/* =========================
          CHAT MESSAGES
      ========================== */}
      {messages.map((msg, index) => (
        <React.Fragment key={index}>

          {/* USER MESSAGE */}
          {msg.sender === "user" && (
            <div className="user-message">

              {/* Uploaded image */}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  className="chat-uploaded-image"
                />
              )}

              {/* User text */}
              {msg.text && (
                <div className="message-text">
                  {msg.text}
                </div>
              )}

              <div className="message-time">
                {msg.time}
              </div>

            </div>
          )}

          {/* BOT MESSAGE */}
          {msg.sender === "bot" && (
            <div className="bot-message">

              <div className="message-text">
                {msg.text}
              </div>

              <div className="message-time">
                {msg.time}
              </div>

            </div>
          )}

        </React.Fragment>
      ))}

      {/* =========================
          LOADING
      ========================== */}
      {loading && (
        <div className="bot-message loading-message">
          <div className="message-text">
            🤖 Generating...
          </div>
        </div>
      )}

      {/* =========================
          AI TRY-ON RESULT
      ========================== */}
      {tryOnResult && (
  <div className="tryon-result-container">
    <div className="tryon-title">
      ✨ Your AI Try-On
    </div>

    <div className="tryon-image-wrapper">
      <img
        src={tryOnResult}
        alt="AI Try-On Result"
        className="tryon-result-image"
      />
    </div>

    <div className="tryon-caption">
      AI-generated preview
    </div>
  </div>
)}

      {/* Scroll reference */}
      <div ref={chatEndRef} />

    </div>
  );
};

export default ChatBody;