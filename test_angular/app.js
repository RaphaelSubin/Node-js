const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const router = require("./router");
app.use("/api", router);



// sequelize.sync({force:true})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
