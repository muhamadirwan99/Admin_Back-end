const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 5000;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup change directory to public
app.use("/images", express.static("images"));

// Setup middleware multer
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("thumbnail")
);

// Configuration mongoose
const db = require("./app/models/");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Directory Home
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to api",
  });
});

// Call routes post
require("./app/routes/post-routes")(app);

// Call routes video
require("./app/routes/video-routes")(app);

// Setup listen port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
