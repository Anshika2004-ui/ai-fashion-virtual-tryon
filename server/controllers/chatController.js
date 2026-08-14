const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatController = async (req, res) => {
  try {
    console.log("\n========== CHAT REQUEST ==========");

    const { message, selectedProduct } = req.body;

    console.log("Message:", message);
    console.log("Selected Product:", selectedProduct);

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        reply: "Please type a message.",
      });
    }

    // Create Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const systemPrompt = `
You are Nova AI, a friendly and intelligent general-purpose AI assistant.

You can help with:

1. Programming
   - JavaScript
   - React
   - Node.js
   - Express
   - MongoDB
   - HTML/CSS
   - Python
   - C++
   - DSA
   - APIs
   - Full-stack development

2. Education
   - College subjects
   - Engineering topics
   - Exam preparation
   - Study plans

3. Career
   - Resume
   - Interviews
   - Placements
   - Projects
   - Career guidance

4. General questions
   - Science
   - Technology
   - Everyday questions
   - Explanations
   - Casual conversation

5. Shopping and fashion
   - Product recommendations
   - Fashion advice
   - Outfit suggestions
   - Virtual try-on

You are NOT only a shopping assistant.

Answer the user's actual question directly.

Give beginner-friendly explanations when appropriate.

If the user asks about programming, include examples when useful.

User's selected product:
${selectedProduct ? JSON.stringify(selectedProduct) : "None"}

User message:
${message}
`;

    console.log("Calling Gemini...");

    const result = await model.generateContent(systemPrompt);

    console.log("Gemini request completed.");

    const response = result.response;

    console.log("Gemini response object received.");

    const reply = response.text();

    console.log("Gemini reply:");
    console.log(reply);

    console.log("=================================\n");

    return res.status(200).json({
      success: true,
      reply: reply,
    });

  } catch (error) {

    console.error("\n========== GEMINI ERROR ==========");
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    console.error("==================================\n");

    return res.status(500).json({
      success: false,
      reply: "Sorry, I couldn't process your message.",
      error: error.message,
    });
  }
};

module.exports = {
  chatController,
};