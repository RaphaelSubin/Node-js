const express = require("express");
const multer = require("multer");
const app = express();

app.get("/", (req, res) => {
  res.send("hellooo");
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("multer called");
    cb(null, "./docs");
  },
  filename: (req, file, cb) => {
    console.log("multer called");
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = new multer({ storage: fileStorage });

app.post("/single", upload.single("demo"), (req, res) => {
  console.log(req.file.path);
  res.send("file uploaded successfully");
});
app.post("/multiple", upload.array("images", 3), (req, res) => {
  console.log(req.files);
  res.send(`multiple upload success`);
});

app.listen(4000, () => {
  console.log("running");
});
