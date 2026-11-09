import "dotenv/config";
import cors from "cors";
import express from "express";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

// CORS is a browser access policy, not an authentication mechanism.
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
}));

// Parse JSON bodies so route handlers can read request.body.
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (request, response) => {
  response.json({ status: "ok", message: "Study Tracker API is running." });
});

app.use("/api/tasks", taskRoutes);

// Keep detailed errors in server logs; return a generic message to the browser.
app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ message: "An unexpected server error occurred." });
});

app.listen(port, () => {
  console.log("Study Tracker API listening on port " + port);
});
