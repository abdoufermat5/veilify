const express = require("express");
const cors = require("cors");
const formidable = require("formidable");
const sharp = require("sharp");
const fs = require("fs");
const app = express();

// Allow from anywhere
const origins = "*";

const corsOptions = {
  origin: origins,
  credentials: true,
  methods: ["*"],
  allowedHeaders: ["*"],
  maxAge: 0,
};

// Pre-flight request handling
app.options("*", cors(corsOptions));

// Then use it before your routes are set up
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({ message: "Hello welcome to Veilify" });
});

app.post("/upload", (req, res) => {
  // Setting up CORS for this specific route
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  const form = new formidable.IncomingForm();
  form.keepExtensions = true; // Keep file extensions

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error", err);
      res.status(500).send(err.message);
      return;
    }

    let blur_coordinates;
    try {
      blur_coordinates = JSON.parse(fields.blur_coordinates);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      res.status(400).send("Invalid JSON for blur coordinates.");
      return;
    }

    const file = files.file instanceof Array ? files.file[0] : files.file;
    const imageFilePath = file.filepath;

    // Validate that the file exists
    if (!fs.existsSync(imageFilePath)) {
      console.error("File not found at path:", imageFilePath);
      res.status(400).send("File not found.");
      return;
    }

    try {
      // Load the image using Sharp with the file path from Formidable
      let image = sharp(imageFilePath);

      // Create an array to hold all the composite operations
      const compositeOperations = blur_coordinates.map((coords) => {
        const [x, y, w, h] = coords;
        return sharp({
          create: {
            width: w,
            height: h,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 1 },
          },
        })
          .png()
          .toBuffer()
          .then((blackOverlay) => ({
            input: blackOverlay,
            top: y,
            left: x,
          }));
      });

      // Wait for all composite operations to finish
      const compositeImages = await Promise.all(compositeOperations);

      // Apply all composite operations to the image
      image = await image.composite(compositeImages).toBuffer();

      const base64Encoded = image.toString("base64");

      res.json({
        filename: files.file.originalFilename,
        content_type: files.file.mimetype,
        blurred_image: base64Encoded,
      });
    } catch (e) {
      console.error("Error processing image:", e);
      res.status(500).send("Error processing image.");
    }
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
