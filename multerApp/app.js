const express = require("express");
const multer = require("multer");
const app = express();
//const upload = multer({ storage: storage }).single("demo_image");

//const fileStorage = multer({ dest: "images/" }).array("images");

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(3000, () => {
  console.log("running");
});

// app.post("/single", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       res.status(400).send("something wrong");
//     }
//     res.send(req.file);
//   });
// });

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/single", upload.single("demo"), (req, res) => {
  console.log(req.file);
  res.send("success");
});

// app.post("/multiple", upload.array("images", 2), (req, res) => {
//   console.log(req.files);
//   res.send("multiple success");
// });
