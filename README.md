# 🤖 AI Fashion Virtual Try-On

A full-stack AI-powered fashion assistant that combines conversational AI with virtual clothing try-on.

Users can chat with the AI assistant, select fashion products, upload a personal photo, and generate an AI-powered preview of the selected clothing using IDM-VTON.

---

## 🚀 Features

### 🤖 AI Shopping Assistant
- General-purpose AI chatbot
- Coding and programming questions
- Study and college assistance
- Career and interview preparation
- Shopping and fashion guidance
- General conversation

### 👕 AI Virtual Try-On
- Select a fashion product
- Upload a personal image
- Send the image securely to the backend
- Generate an AI try-on result using IDM-VTON
- Display the generated result directly inside the chatbot

### 🛍️ Product Selection
- Product cards
- Product images
- Product names
- Product prices
- Try-On action

### 📸 Image Upload
- User image upload using Multer
- Frontend image preview
- Backend file processing

---

## 🧑‍💻 Tech Stack

### Frontend
- React.js
- JavaScript
- CSS
- React Hooks
- Fetch API

### Backend
- Node.js
- Express.js
- REST APIs
- Multer

### AI
- Google Gemini API
- Hugging Face
- IDM-VTON
- Gradio Client

### Development Tools
- Git
- GitHub
- VS Code
- npm

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      User           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │ • Shopping UI       │
                    │ • Chatbot           │
                    │ • Image Upload      │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │                     │
                    │ • Chat Controller   │
                    │ • Try-On Controller │
                    │ • Multer            │
                    └───────┬─────┬───────┘
                            │     │
                  ┌─────────┘     └─────────┐
                  ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │   Gemini AI     │       │ Hugging Face    │
        │   Chatbot       │       │ IDM-VTON        │
        └─────────────────┘       └────────┬────────┘
                                           │
                                           ▼
                                  AI Generated Image
                                           │
                                           ▼
                                  React Try-On Result
