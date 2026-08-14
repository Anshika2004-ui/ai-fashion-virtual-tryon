const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const { tryOn } = require("../controllers/tryOnController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post(
  "/try-on",
  upload.single("image"),
  tryOn
);

module.exports = router;