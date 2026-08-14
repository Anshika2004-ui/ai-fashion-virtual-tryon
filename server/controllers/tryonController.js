const path = require("path");

const tryOn = async (req, res) => {
  console.log("\n========== AI TRY-ON ==========");

  try {
    // ==========================================
    // STEP 1: Controller reached
    // ==========================================

    console.log("STEP 1: Controller reached");

    // ==========================================
    // STEP 2: Check human image
    // ==========================================

    if (!req.file) {
      console.log("STEP 2 FAILED: No file");

      return res.status(400).json({
        success: false,
        message: "No human image was uploaded.",
      });
    }

    console.log("STEP 2: Human image received");
    console.log("File:", req.file.filename);
    console.log("Path:", req.file.path);

    // ==========================================
    // STEP 3: Get selected product
    // ==========================================

    let product = {};

    if (req.body.product) {
      try {
        product =
          typeof req.body.product === "string"
            ? JSON.parse(req.body.product)
            : req.body.product;
      } catch (error) {
        console.log(
          "Product JSON parsing failed:",
          error.message
        );
      }
    }

    console.log("STEP 3: Product:", product);

    // ==========================================
    // STEP 4: Get garment image
    // ==========================================

    let garmentImage =
      product.image ||
      product.imageUrl ||
      product.imageURL ||
      product.src ||
      product.photo ||
      req.body.garmentImage;

    console.log(
      "Original garment image:",
      garmentImage
    );

    // ==========================================
    // CLEAN GARMENT IMAGE URL
    // ==========================================

    if (typeof garmentImage === "string") {
      garmentImage = garmentImage.trim();

      // Convert:
      // [https://example.com/image.jpg](https://example.com/image.jpg)
      //
      // into:
      // https://example.com/image.jpg

      const markdownMatch = garmentImage.match(
        /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/
      );

      if (markdownMatch) {
        garmentImage = markdownMatch[2];
      }

      // If the value still contains Markdown,
      // extract the first HTTPS URL.

      if (garmentImage.includes("](")) {
        const urlMatch = garmentImage.match(
          /https?:\/\/[^\s\])]+/
        );

        if (urlMatch) {
          garmentImage = urlMatch[0];
        }
      }

      // Remove accidental quotes

      garmentImage = garmentImage
        .trim()
        .replace(/^["']|["']$/g, "");
    }

    console.log(
      "Clean garment image:",
      garmentImage
    );

    // ==========================================
    // STEP 5: Validate garment image
    // ==========================================

    if (
      !garmentImage ||
      typeof garmentImage !== "string" ||
      !garmentImage.startsWith("http")
    ) {
      console.log(
        "STEP 5 FAILED: Invalid garment image"
      );

      return res.status(400).json({
        success: false,
        message: "Invalid garment image URL.",
        garmentImage: garmentImage || null,
      });
    }

    // ==========================================
    // STEP 6: Connect to Hugging Face
    // ==========================================

    console.log(
      "STEP 6: Connecting to Hugging Face..."
    );

    const { Client, handle_file } = await import(
      "@gradio/client"
    );

    const app = await Client.connect(
      "yisol/IDM-VTON"
    );

    console.log(
      "STEP 7: Connected to IDM-VTON"
    );

    // ==========================================
    // STEP 8: Prepare human image
    // ==========================================

    console.log(
      "STEP 8: Preparing human image..."
    );

    const humanImage = handle_file(
      path.resolve(req.file.path)
    );

    console.log(
      "Human image prepared"
    );

    // ==========================================
    // STEP 9: Prepare garment image
    // ==========================================

    console.log(
      "STEP 9: Preparing garment image..."
    );

    console.log(
      "Garment URL:",
      garmentImage
    );

    const garmentFile =
      handle_file(garmentImage);

    console.log(
      "Garment image prepared"
    );

    // ==========================================
    // STEP 10: Garment description
    // ==========================================

    const garmentDescription =
      product.name ||
      product.title ||
      req.body.garmentDescription ||
      "clothing";

    console.log(
      "STEP 10: Garment description:",
      garmentDescription
    );

    // ==========================================
    // STEP 11: Call IDM-VTON
    // ==========================================

    console.log(
      "STEP 11: Calling IDM-VTON..."
    );

    console.log(
      "Please wait..."
    );

    const result = await app.predict(
      "/tryon",
      [
        // Human image
        {
          background: humanImage,
          layers: [],
          composite: null,
        },

        // Garment image
        garmentFile,

        // Garment description
        garmentDescription,

        // Auto-mask
        true,

        // Use garment description
        true,

        // Denoising Steps
        // Minimum value is 20
        20,

        // Seed
        3,
      ]
    );

    // ==========================================
    // STEP 12: IDM-VTON response
    // ==========================================

    console.log(
      "STEP 12: IDM-VTON response received"
    );

    console.log(
      "Result:",
      result.data
    );

    // ==========================================
    // STEP 13: Find generated image
    // ==========================================

    if (
      !result.data ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      throw new Error(
        "IDM-VTON did not return any image."
      );
    }

    // IDM-VTON currently returns multiple
    // FileData objects.
    //
    // We use the first generated image.

    const output = result.data[0];

    console.log(
      "Output:",
      output
    );

    let generatedImage = null;

    // ==========================================
    // Handle output URL
    // ==========================================

    if (
      output &&
      typeof output === "object" &&
      output.url
    ) {
      generatedImage = output.url;
    }

    // ==========================================
    // Handle output string
    // ==========================================

    if (
      !generatedImage &&
      typeof output === "string"
    ) {
      generatedImage = output;
    }

    // ==========================================
    // Clean generated URL
    // ==========================================

    if (
      typeof generatedImage === "string"
    ) {
      generatedImage =
        generatedImage.trim();

      // Convert Markdown URL to normal URL

      const markdownMatch =
        generatedImage.match(
          /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/
        );

      if (markdownMatch) {
        generatedImage =
          markdownMatch[2];
      }

      // Extra safety

      if (
        generatedImage.includes("](")
      ) {
        const urlMatch =
          generatedImage.match(
            /https?:\/\/[^\s\])]+/
          );

        if (urlMatch) {
          generatedImage =
            urlMatch[0];
        }
      }
    }

    console.log(
      "Generated image:",
      generatedImage
    );

    // ==========================================
    // STEP 14: Validate generated image
    // ==========================================

    if (!generatedImage) {
      throw new Error(
        "Generated image URL was not found."
      );
    }

    // ==========================================
    // STEP 15: SUCCESS
    // ==========================================

    console.log(
      "\n========== TRY-ON SUCCESS =========="
    );

    console.log(
      "Generated image:",
      generatedImage
    );

    console.log(
      "=====================================\n"
    );

    // ==========================================
    // Send result to React
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "AI Try-On generated successfully!",

      image: generatedImage,

      product: {
        id: product.id || null,
        name:
          product.name ||
          product.title ||
          "Selected Outfit",
      },
    });

  } catch (error) {

    // ==========================================
    // ERROR
    // ==========================================

    console.log(
      "\n========== AI TRY-ON ERROR =========="
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "Full error:",
      error
    );

    console.log(
      "=====================================\n"
    );

    return res.status(500).json({
      success: false,

      message:
        "AI Try-On failed.",

      error: error.message,
    });
  }
};

module.exports = {
  tryOn,
};