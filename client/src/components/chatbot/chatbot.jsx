import React, { useState, useEffect, useRef } from "react";
import "./chatbot.css";

import ChatHeader from "./chatheader";
import ChatBody from "./chatbody";
import ChatInput from "./chatinput";
import FloatingButton from "./floatingbutton";

function Chatbot({
  apiUrl = "http://localhost:5000/chat",
  title = "Nova AI Assistant",
  placeholder = "Ask me anything...",
  welcomeMessage =
    "👋 Hi! I'm Nova AI. I can help with coding, studies, careers, shopping, fashion, and general questions.",
  themeColor = "#10a37f",
  selectedProduct,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [tryOnResult, setTryOnResult] = useState(null);
  // Uploaded image preview
  const [selectedImage, setSelectedImage] = useState(null);

  const chatEndRef = useRef(null);

  // ==========================================
  // LOAD CHAT HISTORY
  // ==========================================
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Failed to load chat history:", error);
        setMessages([
          {
            sender: "bot",
            text: welcomeMessage,
            time: getTime(),
          },
        ]);
      }
    } else {
      setMessages([
        {
          sender: "bot",
          text: welcomeMessage,
          time: getTime(),
        },
      ]);
    }
  }, [welcomeMessage]);

  // ==========================================
  // SAVE CHAT HISTORY
  // ==========================================
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "chatMessages",
        JSON.stringify(messages)
      );
    }
  }, [messages]);

  // ==========================================
  // AUTO SCROLL
  // ==========================================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ==========================================
  // SELECTED PRODUCT
  // ==========================================
  useEffect(() => {
    if (!selectedProduct) return;

    const time = getTime();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: `👕 Selected Product: ${selectedProduct.name}`,
        time,
      },
      {
        sender: "bot",
        text: `✨ Great choice! You selected ${selectedProduct.name}. Upload your photo and I'll try it on for you.`,
        time,
      },
    ]);
  }, [selectedProduct]);

  // ==========================================
  // GET CURRENT TIME
  // ==========================================
  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ==========================================
  // THEME
  // ==========================================
  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  };

  // ==========================================
  // IMAGE UPLOAD / AI TRY-ON
  // ==========================================
  const handleImageUpload = async (e) => {
    const uploadedFile = e.target.files?.[0];

    if (!uploadedFile) {
      return;
    }

      setTryOnResult(null);

    console.log("========== FRONTEND IMAGE TEST ==========");
    console.log("File:", uploadedFile);
    console.log("File name:", uploadedFile.name);
    console.log("File type:", uploadedFile.type);
    console.log("File size:", uploadedFile.size);
    console.log("Selected Product:", selectedProduct);
    console.log("==========================================");

    // Create preview
    const imageURL = URL.createObjectURL(uploadedFile);

    setSelectedImage(imageURL);

    // Show uploaded image in chat
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        image: imageURL,
        text: "📷 Uploaded my photo.",
        time: getTime(),
      },
    ]);

    // ==========================================
    // CHECK PRODUCT
    // ==========================================

    if (!selectedProduct) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "👕 Please select a product first, then upload your photo.",
          time: getTime(),
        },
      ]);

      return;
    }

    // ==========================================
    // FORM DATA
    // ==========================================

    const formData = new FormData();

    formData.append("image", uploadedFile);

    formData.append(
      "product",
      JSON.stringify(selectedProduct)
    );

    console.log("========== FORM DATA ==========");
    console.log("Image:", uploadedFile);
    console.log("Product:", selectedProduct);
    console.log("===============================");

    setLoading(true);

    try {
      // ==========================================
      // SEND TO BACKEND
      // ==========================================

      console.log("Sending image to backend...");

      const response = await fetch(
        "http://localhost:5000/try-on",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(
        "Backend status:",
        response.status
      );

      const data = await response.json();

      console.log("TRY-ON RESPONSE:", data);

      if (data.success && data.image) {
  setTryOnResult(data.image);
}

      

      console.log(
        "========== TRY-ON RESPONSE =========="
      );

      console.log("Response:", data);

      console.log(
        "====================================="
      );

      if (!response.ok || !data.success || !data.image) {
  throw new Error(
    data.error ||
    data.message ||
    "AI Try-On did not return an image."
  );
}

setTryOnResult(data.image);

      // ==========================================
      // GET GENERATED IMAGE
      // ==========================================

      let imageUrl = null;

      if (
        typeof data.generatedImage === "string"
      ) {
        imageUrl = data.generatedImage;
      } else if (
        Array.isArray(data.generatedImage)
      ) {
        imageUrl =
          data.generatedImage[0];
      } else if (
        data.generatedImage &&
        data.generatedImage.url
      ) {
        imageUrl =
          data.generatedImage.url;
      }

      console.log(
        "FINAL AI IMAGE:",
        imageUrl
      );

      if (!imageUrl) {
        throw new Error(
          "AI did not return an image."
        );
      }

      // ==========================================
      // SHOW RESULT
      // ==========================================

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "✨ Here's your AI Try-On result!",
          image: imageUrl,
          time: getTime(),
        },
      ]);
    } catch (error) {
      console.error(
        "========== TRY-ON ERROR =========="
      );

      console.error(error);

      console.error(
        "=================================="
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "❌ AI Try-On failed: " +
            error.message,
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEND NORMAL CHAT MESSAGE
  // ==========================================
  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    const currentMessage = message.trim();

    const time = getTime();

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentMessage,
        time,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      console.log(
        "========== CHAT REQUEST =========="
      );

      console.log(
        "Message:",
        currentMessage
      );

      console.log(
        "Selected Product:",
        selectedProduct
      );

      const response = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: currentMessage,
            selectedProduct:
              selectedProduct || null,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "========== CHAT RESPONSE =========="
      );

      console.log(data);

      console.log(
        "==================================="
      );

      if (!response.ok) {
        throw new Error(
          data.reply ||
            data.message ||
            "Chat request failed."
        );
      }

      // ==========================================
      // SHOW GEMINI RESPONSE
      // ==========================================

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.reply ||
            "Sorry, I couldn't generate a response.",
          time: getTime(),
        },
      ]);
    } catch (error) {
      console.error(
        "========== CHAT ERROR =========="
      );

      console.error(error);

      console.error(
        "================================"
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "❌ Sorry, I couldn't connect to the AI. " +
            error.message,
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR CHAT
  // ==========================================
  const clearChat = () => {
    localStorage.removeItem(
      "chatMessages"
    );

    setMessages([
      {
        sender: "bot",
        text: welcomeMessage,
        time: getTime(),
      },
    ]);

    setSelectedImage(null);
  };

  // ==========================================
  // UI
  // ==========================================
 return (
  <>
    {/* Floating Button */}
    {!isOpen && (
      <FloatingButton
        onClick={() => setIsOpen(true)}
        themeColor={themeColor}
      />
    )}

    {/* Chat Window */}
    {isOpen && (
      <div className={`chat-window ${theme}`}>

        {/* Header */}
        <ChatHeader
          title={title}
          theme={theme}
          toggleTheme={toggleTheme}
          onClose={() => setIsOpen(false)}
          onClear={clearChat}
          themeColor={themeColor}
        />

        {/* Chat Body */}
        <ChatBody
          messages={messages}
          loading={loading}
          welcomeMessage={welcomeMessage}
          chatEndRef={chatEndRef}
          tryOnResult={tryOnResult}
        />

        {/* Input */}
        <ChatInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          selectedImage={selectedImage}
          handleImageUpload={handleImageUpload}
          loading={loading}
          placeholder={placeholder}
        />

      </div>
    )}
  </>
);
}

export default Chatbot;