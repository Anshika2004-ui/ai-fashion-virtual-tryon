import "./App.css";
import { useState } from "react";

import Chatbot from "./components/chatbot";
import ProductList from "./components/shopping/ProductList";

function App() {

  // Selected product
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleTryOn = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        AI Shopping Assistant
      </h1>

      <ProductList onTryOn={handleTryOn} />

      <Chatbot
        apiUrl="http://localhost:5000/chat"
        title="AI Shopping Assistant"
        selectedProduct={selectedProduct}
      />
    </>
  );
}

export default App;