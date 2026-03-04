const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5123",
  }),
);

console.log("Starting server...");

app.get("/", (req, res) => {
  console.log("Received request at /");
  res.json({ message: "Backend is alive" }); //json = structured data
  //res.send("Backend is alive"); plain text = unstructured data
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
