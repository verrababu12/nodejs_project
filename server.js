const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

const loadRoutes = require("./routes/load");
const userRoutes = require("./routes/users");

app.use(loadRoutes);
app.use(userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb Connection Successful!"))
  .catch((error) => console.log("Mongodb Connection Error:", error.message));

app.listen(3001, () => {
  console.log("Server Running at http://localhost:3001");
});

app.get("/", (req, res) => res.send("Hello World!"));
