import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let lastField = null;

app.post("/api/field", (req, res) => {
  console.log("Received JSON:", req.body);
  lastField = req.body;
  res.json({ status: "ok", saved: req.body });
});

app.get("/api/field", (req, res) => {
  if (lastField) {
    res.json({ saved: lastField });
  } else {
    res.json({ message: "No data has been posted yet." });
  }
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
