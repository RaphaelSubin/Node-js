const express = require("express");



const app = new express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get("*", (req, res) =>
  res.status(200).send({
    message: "Hiiiiiiii",
  })
);

const port = 3000;

app.listen(port, () => {
  console.log("app is running at", port);
});
