const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 5000;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // setting destination of uploading files
    if (file.fieldname === "modul") {
      // if uploading modul
      cb(null, "public/moduls");
    } else {
      // else uploading image
      cb(null, "public/images");
    }
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().getTime() + "-" + file.originalname);
//   },
// });

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "modul") {
    // if uploading resume
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else {
    // else uploading image
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }
};

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "50mb", extended: true }));
app.use(
  express.urlencoded({ limit: "500mb", parameterLimit: 100000, extended: true })
);

// Setup change directory to public
app.use("/public/images", express.static("public/images"));
app.use("/public/modul", express.static("public/moduls"));

// Setup middleware multer
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "modul",
      maxCount: 1,
    },
  ])
);
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single("modul")
// );
// app.use(
//   multer({ storage: modulStorage, fileFilter: modulFilter }).single("modul")
// );

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
