import React from "react";
import "./chatbot.css";

function ChatMessage({ sender, text, time }) {
  return (
    <div
      className={
        sender === "user"
          ? "user-message"
          : "bot-message"
      }
    >
      <div className="message-box">
        <span>{text}</span>

        <small>{time}</small>
      </div>
    </div>
  );
}

export default ChatMessage;