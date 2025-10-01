const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const initDB = require("./Database/db");
const { createSchema } = require("./models/User");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("🚀 Registering routes...");

// Health check
app.get("/health", (req, res) => {
  res.json({ message: "Server is healthy ✅" });
});

// Routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 1234;

(async () => {
  try {
    const db = await initDB();   // initialize DB & get pool
    await createSchema(db);      // create tables if needed

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Auth Service running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();
