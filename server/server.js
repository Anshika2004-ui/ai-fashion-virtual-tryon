// ============================================
// LOAD ENVIRONMENT VARIABLES
// ============================================

require("dotenv").config();


// ============================================
// IMPORT PACKAGES
// ============================================

const express = require("express");
const cors = require("cors");
const path = require("path");


// ============================================
// CREATE EXPRESS APP
// ============================================

const app = express();


// ============================================
// MIDDLEWARE
// ============================================

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ============================================
// CHECK API KEYS
// ============================================

console.log("======================================");

console.log(
  "Gemini API key loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

console.log(
  "Replicate token loaded:",
  process.env.REPLICATE_API_TOKEN ? "YES" : "NO"
);

console.log("======================================");


// ============================================
// SERVE UPLOADED IMAGES
// ============================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ============================================
// IMPORT ROUTES
// ============================================

// Gemini Chat
const chatRoutes = require("./routes/chatRoutes");

// AI Try-On
const tryOnRoutes = require("./routes/tryOnRoutes");


// ============================================
// CHAT ROUTE
// ============================================

app.use("/chat", chatRoutes);


// ============================================
// AI TRY-ON ROUTE
// ============================================

// IMPORTANT:
// tryOnRoutes.js already has:
//
// router.post("/try-on", ...)
//
// Therefore we mount it at "/"

app.use("/", tryOnRoutes);


// ============================================
// HOME / TEST ROUTE
// ============================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working!",
  });
});


// ============================================
// REQUEST LOGGER
// ============================================

app.use((req, res, next) => {

  console.log(
    `➡️ REQUEST: ${req.method} ${req.originalUrl}`
  );

  next();

});


// ============================================
// ERROR HANDLER
// ============================================

app.use(
  (err, req, res, next) => {

    console.error(
      "========== SERVER ERROR =========="
    );

    console.error(err);

    console.error(
      "=================================="
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });

  }
);


// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("");

  console.log(
    "======================================"
  );

  console.log(
    `✅ Server running on http://localhost:${PORT}`
  );

  console.log(
    "======================================"
  );

  console.log(
    "🤖 Gemini Chat: POST /chat"
  );

  console.log(
    "👕 AI Try-On:   POST /try-on"
  );

  console.log(
    "======================================"
  );

});